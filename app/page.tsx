"use client";

import { useEffect, useState } from "react";
import InstallButton from "./components/InstallButton";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BoltIcon, 
  CheckCircleIcon, 
  ExclamationTriangleIcon,
  ArrowDownTrayIcon,
  CloudArrowDownIcon 
} from "@heroicons/react/24/solid";

interface FirmwareData {
  versions: string[];
  latest: string;
}

export default function Home() {
  const [versions, setVersions] = useState<string[]>([]);
  const [latest, setLatest] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVersions = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch("/api/versions");
        
        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.statusText}`);
        }
        
        const data: FirmwareData = await response.json();
        
        if (!data || !data.versions) {
          throw new Error("Invalid firmware data received");
        }

        // Sort versions in descending order (newest first)
        const sortedVersions = [...data.versions].sort((a, b) => {
          return b.localeCompare(a, undefined, { numeric: true });
        });
        
        setVersions(sortedVersions);
        setLatest(data.latest || (sortedVersions.length > 0 ? sortedVersions[0] : ""));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load firmware versions");
        console.error("Error fetching versions:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchVersions();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block p-4 bg-white rounded-full shadow-lg mb-4">
            <CloudArrowDownIcon className="w-12 h-12 text-blue-500 animate-bounce" />
          </div>
          <h2 className="text-xl font-semibold text-gray-700">Loading firmware versions...</h2>
        </div>
      </div>
    );
  }

  // if (error) {
  //   return (
  //     <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
  //       <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
  //         <div className="flex items-center justify-center mb-6">
  //           <div className="bg-red-100 p-3 rounded-full">
  //             <ExclamationTriangleIcon className="w-12 h-12 text-red-500" />
  //           </div>
  //         </div>
  //         <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">Oops! Something went wrong</h2>
  //         <p className="text-gray-600 text-center mb-6">{error}</p>
  //         <button
  //           onClick={() => window.location.reload()}
  //           className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
  //         >
  //           Try Again
  //         </button>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3">
            <div className="bg-linear-to-r from-blue-600 to-blue-700 p-3 rounded-xl shadow-lg">
              <BoltIcon className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-linear-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                Smart Meter Factory Flasher
              </h1>
              <p className="text-gray-500 mt-1">
                Select a firmware version to install on your device
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Stats Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ArrowDownTrayIcon className="w-5 h-5 text-gray-400" />
              <span className="text-gray-600 font-medium">Available Versions</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Latest: v{latest}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Total: {versions.length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Versions Grid */}
        {versions.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-gray-100 p-3 rounded-full">
                <ExclamationTriangleIcon className="w-12 h-12 text-gray-400" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No versions available</h3>
            <p className="text-gray-500">Please check back later for firmware updates.</p>
          </div>
        ) : (
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <AnimatePresence>
              {versions.map((version, index) => (
                <motion.div
                  key={version}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.01 }}
                  className={`group relative bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border-2 ${
                    version === latest
                      ? "border-green-500/30 hover:border-green-500"
                      : "border-gray-100 hover:border-blue-500/30"
                  }`}
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-2xl font-bold bg-linear-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                            Version {version}
                          </span>
                          {version === latest && (
                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 text-sm font-semibold rounded-full">
                              <CheckCircleIcon className="w-4 h-4" />
                              Latest
                            </span>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
                            2024-03-20 {/* You can replace this with actual release date */}
                          </span>
                          <span className="flex items-center gap-1">
                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
                            Production Ready
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <InstallButton 
                          manifest={`https://your-s3-url/firmware/${version}/manifest.json`}
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Progress indicator for recommended version */}
                  {version === latest && (
                    <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-green-400 to-green-500 rounded-t-xl"></div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Footer */}
        <div className="mt-12 text-center text-gray-500 text-sm border-t border-gray-200 pt-8">
          <p>© 2024 Smart Meter Factory. All rights reserved.</p>
          <p className="mt-2 text-xs">
            Secure firmware flashing • Verified signatures • Production ready
          </p>
        </div>
      </div>
    </div>
  );
}