import { useState, useEffect } from "react";
import { Camera, Upload, Zap, RotateCcw, ChevronRight, CheckCircle, AlertCircle } from "lucide-react";

export default function VirtualTourCreator({ propertyId, onClose }) {
  const [step, setStep] = useState("guide"); // guide | upload | processing | complete
  const [captureGuide, setCaptureGuide] = useState(null);
  const [uploadedPhotos, setUploadedPhotos] = useState({});
  const [currentRoom, setCurrentRoom] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    fetchCaptureGuide();
  }, [propertyId]);

  const fetchCaptureGuide = async () => {
    try {
      const response = await fetch('/api/functions/generateCaptureGuide', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ propertyId })
      });
      const data = await response.json();
      setCaptureGuide(data);
      if (data.rooms.length > 0) setCurrentRoom(data.rooms[0]);
    } catch (error) {
      console.error('Error fetching capture guide:', error);
    }
  };

  const handlePhotoUpload = (roomId, shotId, file) => {
    const key = `${roomId}-${shotId}`;
    setUploadedPhotos(prev => ({
      ...prev,
      [key]: { file, name: file.name, uploaded: new Date() }
    }));
  };

  const handleStartProcessing = async () => {
    setIsProcessing(true);
    setStep("processing");
    // Simulated processing - in real app, would call backend
    setTimeout(() => {
      setStep("complete");
      setIsProcessing(false);
    }, 3000);
  };

  const completionPercent = captureGuide 
    ? Math.round((Object.keys(uploadedPhotos).length / captureGuide.totalShots) * 100)
    : 0;

  if (!captureGuide) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin">
          <Zap className="w-8 h-8 text-orange-500" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 text-white">
        <h2 className="text-2xl font-black">✨ Create Kemedar Twin™</h2>
        <p className="text-sm text-orange-100 mt-1">Take guided photos of your property</p>
      </div>

      <div className="grid grid-cols-[280px_1fr] gap-0 min-h-[600px]">
        {/* Left Sidebar */}
        <div className="bg-gray-50 border-r p-4 overflow-y-auto">
          <div className="space-y-3">
            <div>
              <p className="text-xs font-black text-gray-600 uppercase tracking-wide">Progress</p>
              <div className="mt-2">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-bold">{Object.keys(uploadedPhotos).length} / {captureGuide.totalShots}</span>
                  <span className="text-sm text-orange-600 font-bold">{completionPercent}%</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-orange-400 to-orange-600 transition-all"
                    style={{ width: `${completionPercent}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Room List */}
            <div className="mt-6 space-y-1">
              {captureGuide.rooms.map(room => {
                const roomPhotosCount = room.requiredShots.filter(
                  s => uploadedPhotos[`${room.roomId}-${s.shotId}`]
                ).length;
                const isComplete = roomPhotosCount === room.requiredShots.length;
                
                return (
                  <button
                    key={room.roomId}
                    onClick={() => setCurrentRoom(room)}
                    className={`w-full text-left px-3 py-2.5 rounded-lg transition-all text-sm ${
                      currentRoom?.roomId === room.roomId
                        ? 'bg-white border border-orange-300 shadow-sm'
                        : 'hover:bg-white border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${
                        isComplete ? 'bg-green-500' : roomPhotosCount > 0 ? 'bg-orange-500' : 'bg-gray-300'
                      }`} />
                      <span className="flex-1 font-semibold">{room.roomLabel}</span>
                      <span className="text-xs text-gray-500">{roomPhotosCount}/{room.requiredShots.length}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6 overflow-y-auto">
          {step === "guide" && currentRoom && (
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-black text-gray-900 mb-2">{currentRoom.roomLabel}</h3>
                <p className="text-gray-600">Take these photos in order for best results</p>
              </div>

              {/* Required Shots */}
              <div className="space-y-4">
                {currentRoom.requiredShots.map(shot => {
                  const photoKey = `${currentRoom.roomId}-${shot.shotId}`;
                  const isUploaded = uploadedPhotos[photoKey];
                  
                  return (
                    <div 
                      key={shot.shotId}
                      className={`border-2 rounded-2xl p-4 transition-all ${
                        isUploaded 
                          ? 'border-green-300 bg-green-50' 
                          : 'border-dashed border-orange-300 bg-white'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-bold text-gray-900">{shot.shotName}</h4>
                          <p className="text-sm text-gray-600">{shot.description}</p>
                        </div>
                        {isUploaded && <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />}
                      </div>

                      {!isUploaded && (
                        <div className="space-y-3 mb-4">
                          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 text-sm">
                            <p className="font-semibold text-orange-900 mb-1">📍 Position: {shot.cameraPosition}</p>
                            <p className="text-orange-800">{shot.tips.join(" • ")}</p>
                          </div>

                          <div className="flex gap-2">
                            <label className="flex-1 px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-lg cursor-pointer text-center transition-all">
                              📷 Take Photo
                              <input 
                                type="file" 
                                accept="image/*" 
                                className="hidden"
                                onChange={(e) => {
                                  if (e.target.files[0]) {
                                    handlePhotoUpload(currentRoom.roomId, shot.shotId, e.target.files[0]);
                                  }
                                }}
                              />
                            </label>
                            <label className="flex-1 px-4 py-2.5 border-2 border-orange-500 text-orange-600 font-bold rounded-lg cursor-pointer hover:bg-orange-50 transition-all">
                              🖼️ Upload
                              <input 
                                type="file" 
                                accept="image/*" 
                                className="hidden"
                                onChange={(e) => {
                                  if (e.target.files[0]) {
                                    handlePhotoUpload(currentRoom.roomId, shot.shotId, e.target.files[0]);
                                  }
                                }}
                              />
                            </label>
                          </div>
                        </div>
                      )}

                      {isUploaded && (
                        <div className="flex items-center gap-3 bg-white p-3 rounded-lg">
                          <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                            <img 
                              src={URL.createObjectURL(isUploaded.file)} 
                              alt="uploaded"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-gray-700 truncate">{isUploaded.name}</p>
                            <p className="text-xs text-gray-500">✅ Uploaded</p>
                          </div>
                          <button 
                            onClick={() => {
                              const newPhotos = { ...uploadedPhotos };
                              delete newPhotos[photoKey];
                              setUploadedPhotos(newPhotos);
                            }}
                            className="text-red-500 hover:text-red-700 font-bold text-sm"
                          >
                            🗑 Remove
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {completionPercent === 100 && (
                <button
                  onClick={handleStartProcessing}
                  disabled={isProcessing}
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:opacity-50 text-white font-black py-3 rounded-xl text-lg transition-all"
                >
                  {isProcessing ? '⏳ Processing...' : '🚀 Generate Virtual Tour'}
                </button>
              )}
            </div>
          )}

          {step === "processing" && (
            <div className="flex flex-col items-center justify-center h-96 space-y-6">
              <div className="animate-spin">
                <Zap className="w-12 h-12 text-orange-500" />
              </div>
              <h3 className="text-2xl font-black text-gray-900">✨ Creating Your Virtual Tour</h3>
              <div className="space-y-2 w-full max-w-md text-sm text-gray-600">
                <p className="flex items-center gap-2"><span className="animate-pulse">🔄</span> Analyzing photos...</p>
                <p className="flex items-center gap-2"><span>✅</span> Photo quality verified</p>
                <p className="flex items-center gap-2"><span className="animate-pulse">🔄</span> Stitching 360° scenes...</p>
              </div>
            </div>
          )}

          {step === "complete" && (
            <div className="flex flex-col items-center justify-center h-96 space-y-6 text-center">
              <CheckCircle className="w-20 h-20 text-green-500" />
              <div>
                <h3 className="text-2xl font-black text-gray-900 mb-2">🎉 Virtual Tour Ready!</h3>
                <p className="text-gray-600">Your Kemedar Twin™ has been created successfully</p>
              </div>
              <div className="flex gap-3 w-full max-w-sm">
                <button
                  onClick={() => {
                    setStep("guide");
                    onClose();
                  }}
                  className="flex-1 bg-white border-2 border-gray-300 hover:border-gray-400 text-gray-900 font-bold py-3 rounded-xl transition-all"
                >
                  ← Back
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl transition-all"
                >
                  ✅ Done
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}