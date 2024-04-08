import React from 'react';
import { useNavigate } from 'react-router-dom';

function HomePage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Hero Section */}
            <div className="text-center p-10 bg-gradient-to-r from-blue-500 to-purple-600">
                <img src="/gitminion.png" alt="GitMinion Logo" className="mx-auto h-40" />
                <h1 className="text-white text-4xl font-bold">Automate Your GitLab Pipelines</h1>
                {/* <h1 className="text-white text-4xl font-bold">Automate Your GitLab Pipelines</h1> */}
                <p className="text-white mt-2">Simplify your CI/CD workflow with GitMinion</p>
                <button
                    onClick={() => navigate('/run')}
                    className="mt-4 mr-2 px-6 py-2 bg-white text-purple-600 font-semibold rounded-lg shadow-md"
                >
                    Run Pipeline
                </button>
                <button
                    onClick={() => navigate('/link')}
                    className="mt-4 ml-2 px-6 py-2 bg-white text-purple-600 font-semibold rounded-lg shadow-md"
                >
                    Generate CI/CD Editor Link
                </button>
            </div>

            {/* Features Overview */}
            <div className="my-12 mx-auto max-w-4xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Feature 1 */}
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h2 className="text-xl font-bold text-gray-800 mb-2">Trigger Pipelines with Ease</h2>
                        <p className="text-gray-600">Quickly run your GitLab pipelines directly from GitMinion, saving time and reducing manual errors.</p>
                    </div>

                    {/* Feature 2 */}
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h2 className="text-xl font-bold text-gray-800 mb-2">Pipeline Configuration Made Simple</h2>
                        <p className="text-gray-600">Easily generate and open CI/CD pipeline editor pages with pre-filled settings for your projects.</p>
                    </div>
                </div>
            </div>

            {/* Quick Start Guide or other sections can be added here */}
        </div>
    );
}

export default HomePage;
