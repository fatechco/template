import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Eye, Calendar, Camera, BarChart2, Play, CheckCircle, AlertCircle, Plus } from "lucide-react";
import SiteHeader from "@/components/header/SiteHeader";
import SiteFooter from "@/components/home/SiteFooter";
import VirtualTourCreator from "@/components/twin/VirtualTourCreator";
import LiveTourScheduler from "@/components/twin/LiveTourScheduler";
import { base44 } from "@/api/base44Client";

export default function TwinDashboard() {
  const { propertyId } = useParams();
  const [property, setProperty] = useState(null);
  const [tours, setTours] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [view, setView] = useState("overview"); // overview | create | schedule
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [propertyId]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [props, toursData, sessionsData] = await Promise.all([
        base44.entities.Property.filter({ id: propertyId }),
        base44.entities.VirtualTour.filter({ propertyId }),
        base44.entities.LiveTourSession.filter({ propertyId })
      ]);
      if (props.length) setProperty(props[0]);
      setTours(toursData);
      setSessions(sessionsData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleScheduleTour = async (sessionData) => {
    await base44.entities.LiveTourSession.create({
      ...sessionData,
      inviteCode: Math.random().toString(36).substring(2, 8).toUpperCase(),
      inviteLink: `https://kemedar.com/tour/join/${Math.random().toString(36).substring(2, 10)}`
    });
    setView("overview");
    loadData();
  };

  const activeTour = tours.find(t => t.status === "published");
  const upcomingSession = sessions.find(s => s.status === "scheduled");
  const verification = tours.find(t => t.status === "published")?.franchiseOwnerVerified;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <SiteHeader />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <SiteHeader />
      <div className="max-w-6xl mx-auto px-4 py-8 w-full flex-1">
        {/* Menu */}
        <div className="mb-6 flex gap-1 border-b border-gray-200">
          {[
            { id: "overview", label: "Overview", icon: "📊" },
            { id: "tours", label: "Virtual Tours", icon: "🎬" },
            { id: "sessions", label: "Live Sessions", icon: "📡" },
            { id: "recordings", label: "Recordings", icon: "📹" },
            { id: "settings", label: "Settings", icon: "⚙️" }
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`px-4 py-3 text-sm font-bold transition-all border-b-2 ${
                view === item.id
                  ? "border-orange-500 text-orange-600"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              {item.icon} {item.label}
            </button>
          ))}
        </div>

         {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
            <Link to="/dashboard/my-properties" className="hover:text-orange-500 transition-colors">My Properties</Link>
            <span>/</span>
            <span className="text-gray-700">{property?.title || "Property"}</span>
            <span>/</span>
            <span className="text-gray-700">Kemedar Twin™</span>
          </div>
          <h1 className="text-3xl font-black text-gray-900 mb-1">✨ Kemedar Twin™</h1>
          <p className="text-gray-600">Manage virtual tours and live sessions for your property</p>
        </div>

        {view === "overview" && (
          <div className="grid grid-cols-3 gap-6 mb-8">
            {/* Virtual Tour Card */}
            <div className={`bg-white rounded-2xl shadow-sm border p-6 ${activeTour ? 'border-green-300' : 'border-gray-100'}`}>
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                  <Camera className="w-6 h-6 text-orange-500" />
                </div>
                {activeTour ? (
                  <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full">✅ Active</span>
                ) : (
                  <span className="bg-gray-100 text-gray-500 text-xs font-bold px-2 py-1 rounded-full">Not Created</span>
                )}
              </div>
              <h3 className="font-black text-gray-900 mb-1">Virtual Tour</h3>
              {activeTour ? (
                <div className="space-y-2 mb-4">
                  <p className="text-sm text-gray-600">{activeTour.totalViews || 0} total views</p>
                  <p className="text-sm text-gray-600">{activeTour.tourScenes?.length || 0} scenes</p>
                </div>
              ) : (
                <p className="text-sm text-gray-500 mb-4">Properties with tours get 3× more inquiries</p>
              )}
              {activeTour ? (
                <div className="flex gap-2">
                  <Link 
                    to={`/kemedar/tour/${activeTour.id}`}
                    className="flex-1 text-center text-xs font-bold bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg transition-colors"
                  >
                    👁 Preview
                  </Link>
                  <button 
                    onClick={() => setView("create")}
                    className="flex-1 text-xs font-bold bg-orange-100 hover:bg-orange-200 text-orange-700 px-3 py-2 rounded-lg transition-colors"
                  >
                    ✏️ Edit
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => setView("create")}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 rounded-lg text-sm transition-colors"
                >
                  + Create Tour
                </button>
              )}
            </div>

            {/* Live Tours Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-blue-500" />
                </div>
                <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded-full">
                  {sessions.filter(s => s.status === "scheduled").length} Upcoming
                </span>
              </div>
              <h3 className="font-black text-gray-900 mb-1">Live Tours</h3>
              {upcomingSession ? (
                <div className="mb-4">
                  <p className="text-sm font-semibold text-gray-700">{upcomingSession.title}</p>
                  <p className="text-xs text-gray-500">{new Date(upcomingSession.scheduledFor).toLocaleDateString()}</p>
                </div>
              ) : (
                <p className="text-sm text-gray-500 mb-4">No upcoming tours scheduled</p>
              )}
              <button 
                onClick={() => setView("schedule")}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 rounded-lg text-sm transition-colors"
              >
                + Schedule Tour
              </button>
            </div>

            {/* Verification Card */}
            <div className={`bg-white rounded-2xl shadow-sm border p-6 ${verification ? 'border-green-300' : 'border-gray-100'}`}>
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${verification ? 'bg-green-100' : 'bg-gray-100'}`}>
                  {verification ? (
                    <CheckCircle className="w-6 h-6 text-green-500" />
                  ) : (
                    <AlertCircle className="w-6 h-6 text-gray-400" />
                  )}
                </div>
                {verification ? (
                  <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full">✅ Verified</span>
                ) : (
                  <span className="bg-gray-100 text-gray-500 text-xs font-bold px-2 py-1 rounded-full">Not Verified</span>
                )}
              </div>
              <h3 className="font-black text-gray-900 mb-1">Verification Status</h3>
              {verification ? (
                <p className="text-sm text-gray-600 mb-4">Property verified by Franchise Owner</p>
              ) : (
                <p className="text-sm text-gray-500 mb-4">Get verified by a local Franchise Owner for higher trust</p>
              )}
              {!verification && (
                <button 
                  onClick={() => setView("schedule")}
                  className="w-full bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 rounded-lg text-sm transition-colors"
                >
                  Request Verification
                </button>
              )}
            </div>
          </div>
        )}

        {/* Analytics */}
        {view === "overview" && activeTour && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
            <h2 className="font-black text-gray-900 text-lg mb-4">📊 Virtual Tour Performance</h2>
            <div className="grid grid-cols-4 gap-4">
              {[
                { label: "Total Views", value: "1,234", icon: Eye },
                { label: "Avg Duration", value: "3:45 min", icon: Play },
                { label: "Completion Rate", value: "67%", icon: CheckCircle },
                { label: "Inquiries", value: "12", icon: BarChart2 }
              ].map(stat => (
                <div key={stat.label} className="bg-orange-50 rounded-xl p-4 text-center">
                  <stat.icon className="w-6 h-6 text-orange-500 mx-auto mb-2" />
                  <p className="text-2xl font-black text-gray-900">{stat.value}</p>
                  <p className="text-xs text-gray-500">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Session history */}
        {view === "overview" && sessions.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-black text-gray-900 text-lg mb-4">📋 Live Tour History</h2>
            <div className="space-y-3">
              {sessions.map(session => (
                <div key={session.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <p className="font-bold text-gray-900">{session.title}</p>
                    <p className="text-sm text-gray-500">{session.sessionType} • {new Date(session.scheduledFor).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                      session.status === "ended" ? "bg-gray-100 text-gray-600" :
                      session.status === "live" ? "bg-red-100 text-red-600" :
                      "bg-blue-100 text-blue-600"
                    }`}>{session.status.toUpperCase()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {view === "create" && (
          <VirtualTourCreator
            propertyId={propertyId}
            onClose={() => setView("overview")}
          />
        )}

        {view === "schedule" && (
          <LiveTourScheduler
            propertyId={propertyId}
            propertyName={property?.title || "Property"}
            onSchedule={handleScheduleTour}
          />
        )}

        {view === "tours" && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-black text-gray-900 text-lg mb-4">🎬 Virtual Tours</h2>
            {tours.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No virtual tours yet. Create one to get started!</p>
            ) : (
              <div className="space-y-3">
                {tours.map(tour => (
                  <div key={tour.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <p className="font-bold text-gray-900">{tour.tourType || 'Virtual Tour'}</p>
                      <p className="text-sm text-gray-500">{tour.totalViews || 0} views • {tour.tourScenes?.length || 0} scenes</p>
                    </div>
                    <Link 
                      to={`/kemedar/tour/${tour.id}`}
                      className="text-xs font-bold bg-orange-500 text-white px-3 py-2 rounded-lg hover:bg-orange-600 transition-colors"
                    >
                      View
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {view === "sessions" && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-black text-gray-900 text-lg mb-4">📡 Live Sessions</h2>
            {sessions.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No live sessions scheduled yet.</p>
            ) : (
              <div className="space-y-3">
                {sessions.map(session => (
                  <div key={session.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <p className="font-bold text-gray-900">{session.title}</p>
                      <p className="text-sm text-gray-500">{new Date(session.scheduledFor).toLocaleDateString()} • {session.sessionType}</p>
                    </div>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                      session.status === "live" ? "bg-red-100 text-red-600" :
                      session.status === "ended" ? "bg-gray-100 text-gray-600" :
                      "bg-blue-100 text-blue-600"
                    }`}>{session.status.toUpperCase()}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {view === "recordings" && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-black text-gray-900 text-lg mb-4">📹 Recordings</h2>
            {sessions.filter(s => s.status === "ended").length === 0 ? (
              <p className="text-gray-500 text-center py-8">No recordings available yet. Schedule a live session to create recordings.</p>
            ) : (
              <div className="space-y-3">
                {sessions.filter(s => s.status === "ended").map(session => (
                  <div key={session.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <p className="font-bold text-gray-900">{session.title}</p>
                      <p className="text-sm text-gray-500">{new Date(session.scheduledFor).toLocaleDateString()} • Recording</p>
                    </div>
                    <button className="text-xs font-bold bg-gray-300 text-gray-700 px-3 py-2 rounded-lg">
                      ▶ Play
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {view === "settings" && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-black text-gray-900 text-lg mb-4">⚙️ Settings</h2>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="font-bold text-gray-900 mb-1">Display Settings</p>
                <p className="text-sm text-gray-500 mb-3">Customize how your tours appear to visitors</p>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" defaultChecked className="w-4 h-4" />
                  <span className="text-sm text-gray-700">Show measurements</span>
                </label>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="font-bold text-gray-900 mb-1">Floor Plan</p>
                <p className="text-sm text-gray-500 mb-3">Upload and display floor plan</p>
                <button className="text-xs font-bold bg-orange-500 text-white px-3 py-2 rounded-lg hover:bg-orange-600 transition-colors">
                  Upload Floor Plan
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <SiteFooter />
    </div>
  );
}