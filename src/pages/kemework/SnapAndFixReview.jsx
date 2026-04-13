import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import DiagnosisHeader from "@/components/snap-and-fix/diagnosis/DiagnosisHeader";
import SafetyAlertBanner from "@/components/snap-and-fix/diagnosis/SafetyAlertBanner";
import DiagnosisCard from "@/components/snap-and-fix/diagnosis/DiagnosisCard";
import ContractorBriefCard from "@/components/snap-and-fix/diagnosis/ContractorBriefCard";
import TaskDetailsCard from "@/components/snap-and-fix/diagnosis/TaskDetailsCard";
import DiagnosisStickyBar from "@/components/snap-and-fix/diagnosis/DiagnosisStickyBar";
import LoginPromptModal from "@/components/snap-and-fix/diagnosis/LoginPromptModal";
import RequiredMaterialsCard from "@/components/snap-and-fix/materials/RequiredMaterialsCard";

function LoadingSkeleton() {
  return (
    <div className="animate-pulse space-y-4 px-4 py-4">
      <div className="h-28 bg-gray-100 rounded-2xl" />
      <div className="h-40 bg-gray-100 rounded-2xl" />
      <div className="h-48 bg-gray-100 rounded-2xl" />
      <div className="h-48 bg-gray-100 rounded-2xl" />
    </div>
  );
}

function ErrorState({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
      <p className="text-5xl mb-4">😕</p>
      <p className="text-lg font-black text-gray-800 mb-2">Diagnosis Not Found</p>
      <p className="text-sm text-gray-500 mb-6">{message || "The diagnosis session could not be loaded."}</p>
      <button
        onClick={onRetry}
        className="px-6 py-2.5 bg-teal-500 text-white font-bold rounded-xl text-sm"
      >
        Try Again
      </button>
    </div>
  );
}

export default function SnapAndFixReview() {
  const { sessionId } = useParams();
  const navigate = useNavigate();

  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Editable fields
  const [description, setDescription] = useState("");
  const [arabicDescription, setArabicDescription] = useState("");
  const [userEdited, setUserEdited] = useState(false);

  // Task details
  const [budget, setBudget] = useState("");
  const [openToBids, setOpenToBids] = useState(true);
  const [taskLocation, setTaskLocation] = useState("");
  const [schedule, setSchedule] = useState("flexible");

  // UI states
  const [isPosting, setIsPosting] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [posted, setPosted] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const [userData, sessions] = await Promise.all([
          base44.auth.me().catch(() => null),
          base44.entities.SnapSession.filter({ id: sessionId }, "-created_date", 1),
        ]);

        setUser(userData);

        if (!sessions?.length) {
          setError("Session not found. It may have expired.");
          return;
        }

        const s = sessions[0];
        setSession(s);
        setDescription(s.technicalDescription || "");
        setArabicDescription(s.technicalDescriptionAr || "");
        setTaskLocation(s.locationText || "");

        // Pre-select ASAP for emergency/high
        if (s.urgencyLevel === "emergency" || s.urgencyLevel === "high") {
          setSchedule("asap");
        }
      } catch (e) {
        setError(e.message || "Failed to load diagnosis.");
      } finally {
        setLoading(false);
      }
    };

    if (sessionId) load();
  }, [sessionId]);

  const handlePostTask = async () => {
    // Guest: show login prompt
    if (!user) {
      setShowLoginModal(true);
      return;
    }

    setIsPosting(true);
    try {
      // Save any edits back to the session
      if (userEdited) {
        await base44.entities.SnapSession.update(sessionId, {
          technicalDescription: description,
          technicalDescriptionAr: arabicDescription,
          userEditedDescription: true,
        });
      }

      // Call the convertSnapToTask backend function
      const response = await base44.functions.invoke("convertSnapToTask", {
        snapSessionId: sessionId,
        userId: user.id,
        editedDescription: userEdited ? description : undefined,
        userBudgetEGP: openToBids ? null : parseFloat(budget) || null,
        locationText: taskLocation,
      });

      const taskId = response?.data?.task?.id;
      setPosted(true);

      if (taskId) {
        navigate(`/kemework/task/${taskId}`);
      } else {
        navigate(`/kemework/post-task?fromSnap=${sessionId}`);
      }
    } catch (e) {
      console.error(e);
      // Fallback: navigate to post-task with pre-fill
      navigate(`/kemework/post-task?fromSnap=${sessionId}`);
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#F8FAFC" }}>
      {/* Header */}
      <DiagnosisHeader sessionId={sessionId} />

      {/* Safety Banner — appears right after header */}
      {!loading && session && (
        <SafetyAlertBanner
          urgencyLevel={session.urgencyLevel}
          safetyWarning={session.safetyWarning}
        />
      )}

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 pb-36">

        {loading && <LoadingSkeleton />}

        {!loading && error && (
          <ErrorState message={error} onRetry={() => window.location.reload()} />
        )}

        {!loading && !error && session && (
          <>
            {/* Photo thumbnail */}
            {session.originalImageUrl && (
              <div className="rounded-2xl overflow-hidden shadow-sm" style={{ maxHeight: 200 }}>
                <img
                  src={session.originalImageUrl}
                  alt="Snapped issue"
                  className="w-full object-cover"
                  style={{ maxHeight: 200 }}
                />
              </div>
            )}

            {/* Card 1: Diagnosis */}
            <DiagnosisCard session={session} />

            {/* Card 2: Contractor Brief */}
            <ContractorBriefCard
              session={session}
              description={description}
              setDescription={setDescription}
              arabicDescription={arabicDescription}
              setArabicDescription={setArabicDescription}
              onEdit={() => setUserEdited(true)}
            />

            {/* Card 3: Task Details */}
            <TaskDetailsCard
              session={session}
              budget={budget}
              setBudget={setBudget}
              openToBids={openToBids}
              setOpenToBids={setOpenToBids}
              location={taskLocation}
              setLocation={setTaskLocation}
              schedule={schedule}
              setSchedule={setSchedule}
            />

            {/* Card 4: Required Materials (Kemetro cross-module) */}
            <RequiredMaterialsCard
              session={session}
              onSessionUpdate={(updates) => setSession(s => ({ ...s, ...updates }))}
            />

            {/* Bottom spacer */}
            <div style={{ height: 16 }} />
          </>
        )}
      </div>

      {/* Sticky Bottom Bar */}
      {!loading && !error && session && (
        <DiagnosisStickyBar
          session={session}
          onPostTask={handlePostTask}
          isPosting={isPosting}
          isGuest={!user}
        />
      )}

      {/* Login Modal */}
      {showLoginModal && (
        <LoginPromptModal
          sessionId={sessionId}
          session={session}
          onClose={() => setShowLoginModal(false)}
        />
      )}
    </div>
  );
}