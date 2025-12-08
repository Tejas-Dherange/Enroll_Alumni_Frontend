import React from 'react';

interface PageLoaderProps {
    variant?: 'shimmer' | 'dots' | 'pulse' | 'skeleton';
    message?: string;
}

/**
 * A modern, fast-feeling full-page loader component
 * Designed to reduce perceived waiting time with smooth animations
 */
const PageLoader: React.FC<PageLoaderProps> = ({
    variant = 'shimmer',
    message = 'Loading...'
}) => {
    const renderLoader = () => {
        switch (variant) {
            case 'shimmer':
                return (
                    <div className="space-y-4 w-full max-w-2xl">
                        {/* Shimmer bars with gradient animation */}
                        {[...Array(5)].map((_, i) => (
                            <div
                                key={i}
                                className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg shimmer-animation"
                                style={{
                                    width: `${100 - i * 10}%`,
                                    animationDelay: `${i * 0.1}s`,
                                }}
                            />
                        ))}
                    </div>
                );

            case 'dots':
                return (
                    <div className="flex space-x-3">
                        {[...Array(3)].map((_, i) => (
                            <div
                                key={i}
                                className="w-4 h-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full dot-bounce"
                                style={{ animationDelay: `${i * 0.15}s` }}
                            />
                        ))}
                    </div>
                );

            case 'pulse':
                return (
                    <div className="relative w-32 h-32">
                        {/* Concentric circles with pulsing animation */}
                        {[...Array(3)].map((_, i) => (
                            <div
                                key={i}
                                className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400/30 to-purple-600/30 pulse-ring"
                                style={{ animationDelay: `${i * 0.4}s` }}
                            />
                        ))}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full" />
                        </div>
                    </div>
                );

            case 'skeleton':
                return (
                    <div className="w-full max-w-3xl space-y-6">
                        {/* Dashboard-like skeleton */}
                        <div className="flex items-center space-x-4">
                            <div className="w-16 h-16 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full shimmer-animation" />
                            <div className="flex-1 space-y-2">
                                <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded shimmer-animation w-1/3" />
                                <div className="h-3 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded shimmer-animation w-1/2" />
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            {[...Array(3)].map((_, i) => (
                                <div
                                    key={i}
                                    className="h-24 bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl shimmer-animation"
                                    style={{ animationDelay: `${i * 0.1}s` }}
                                />
                            ))}
                        </div>

                        <div className="space-y-3">
                            {[...Array(4)].map((_, i) => (
                                <div
                                    key={i}
                                    className="h-12 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg shimmer-animation"
                                    style={{
                                        animationDelay: `${i * 0.1}s`,
                                        width: `${95 - i * 5}%`,
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <>
            {/* Inject keyframe animations into the document */}
            <style>{`
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }

        @keyframes dotBounce {
          0%, 80%, 100% {
            transform: scale(0.8) translateY(0);
            opacity: 0.7;
          }
          40% {
            transform: scale(1.1) translateY(-10px);
            opacity: 1;
          }
        }

        @keyframes pulseRing {
          0% {
            transform: scale(0.5);
            opacity: 0.8;
          }
          50% {
            opacity: 0.4;
          }
          100% {
            transform: scale(1.3);
            opacity: 0;
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .shimmer-animation {
          background-size: 200% 100%;
          animation: shimmer 1.5s ease-in-out infinite;
        }

        .dot-bounce {
          animation: dotBounce 1.2s ease-in-out infinite;
        }

        .pulse-ring {
          animation: pulseRing 1.6s ease-out infinite;
        }

        .fade-in {
          animation: fadeIn 0.3s ease-in;
        }
      `}</style>

            {/* Full-page loader overlay */}
            <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100 fade-in">
                {/* Animated background gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-purple-50/30 to-pink-50/50 opacity-60" />

                {/* Content container */}
                <div className="relative z-10 flex flex-col items-center space-y-8 px-4">
                    {renderLoader()}

                    {/* Optional loading message */}
                    {message && (
                        <p className="text-gray-600 font-medium text-lg tracking-wide animate-pulse">
                            {message}
                        </p>
                    )}
                </div>
            </div>
        </>
    );
};

export default PageLoader;
