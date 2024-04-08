import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function SettingsPage() {
    const storedGitlabLink = localStorage.getItem('gitlabLink') || 'https://gitlab.com/';
    const storedToken = localStorage.getItem('accessToken');
    const [gitlabLink, setGitlabLink] = useState(storedGitlabLink || '');
    const [accessToken, setAccessToken] = useState(storedToken || '');

    const navigate = useNavigate();

    const saveSettings = () => {
        localStorage.setItem('gitlabLink', gitlabLink);
        localStorage.setItem('accessToken', accessToken);
        alert('Settings saved successfully!');
        navigate('/');
    };

    return (
        <div className="App bg-gradient-to-r from-blue-500 to-purple-600 min-h-screen flex items-center justify-center">
            <div className="bg-white p-10 rounded-lg shadow-lg min-w-[400px]">
                <h2 className="mb-4 text-xl font-semibold text-gray-700">Settings</h2>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="gitlabLink">
                        GitLab Link
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="gitlabLink"
                        type="text"
                        placeholder="GitLab URL"
                        value={gitlabLink}
                        onChange={(e) => setGitlabLink(e.target.value)}
                    />
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="accessToken">
                        Personal Access Token
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                        id="accessToken"
                        type="text"
                        placeholder="Token"
                        value={accessToken}
                        onChange={(e) => setAccessToken(e.target.value)}
                    />
                </div>
                <div className="flex items-center justify-between">
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        type="button"
                        onClick={saveSettings}
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
}

export default SettingsPage;
