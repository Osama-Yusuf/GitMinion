import React, { useState } from 'react';
import Inputs from '../components/Inputs';
import useGitLabData from '../hooks/useGitLabData';


function RunPage() {
    const {
        selectedGroup, setSelectedGroup,
        selectedMicroservice, setSelectedMicroservice,
        selectedBranch, setSelectedBranch,
        gitlabLink,
    } = useGitLabData();
    const [envKey, setEnvKey] = useState('ENV');
    const [envValue, setEnvValue] = useState('');
    const [includeEnvVars, setIncludeEnvVars] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const accessToken = localStorage.getItem('accessToken');
        const gitlabApi = `${gitlabLink}/api/v4`;
        const headers = { 'PRIVATE-TOKEN': accessToken };

        try {
            const groupId = selectedGroup.value;
            if (!groupId) throw new Error('Group ID not found');

            const projectId = selectedMicroservice.value;
            if (!projectId) throw new Error('Project ID not found');

            const triggerResponse = await fetch(`${gitlabApi}/projects/${projectId}/triggers`, { headers });
            const triggerData = await triggerResponse.json();
            const projectToken = triggerData[0]?.token;

            if (!projectToken) throw new Error('Project trigger token not found');

            // Trigger pipeline
            const triggerUrl = `${gitlabApi}/projects/${projectId}/trigger/pipeline`;
            const formDataObj = new FormData();
            formDataObj.append('token', projectToken);
            formDataObj.append('ref', selectedBranch.value);


            if (includeEnvVars) {
                formDataObj.append(`variables[${envKey}]`, envValue);
            }

            const pipelineResponse = await fetch(triggerUrl, {
                method: 'POST',
                body: formDataObj
            });

            if (!pipelineResponse.ok) {
                throw new Error(`HTTP error! Status: ${pipelineResponse.status}`);
            }

            const pipelineResult = await pipelineResponse.json();
            window.open(`${gitlabLink}/${selectedGroup.label}/${selectedMicroservice.label}/-/pipelines/${pipelineResult.id}`, '_blank');

        } catch (error) {
            console.error('Error:', error);
        }
    };

    const { hasToken } = useGitLabData();
    if (!hasToken) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p>Please enter your personal access token in the settings.</p>
            </div>
        );
    }

    // Callbacks for selection changes
    const handleGroupSelect = (group) => setSelectedGroup(group);
    const handleMicroserviceSelect = (microservice) => setSelectedMicroservice(microservice);
    const handleBranchSelect = (branch) => setSelectedBranch(branch);

    return (
        <div className="App bg-gradient-to-r from-blue-500 to-purple-600 min-h-screen flex items-center justify-center">
            <div className="bg-white p-10 rounded-lg shadow-lg min-w-[400px]">
                <form onSubmit={handleSubmit} className="bg-white p-10 rounded-lg shadow-lg min-w-[400px]">

                    <h2 className="text-2xl font-bold mb-8 text-gray-800 text-center">Run GitLab Pipeline</h2>
                    <Inputs
                        onGroupSelect={handleGroupSelect}
                        onMicroserviceSelect={handleMicroserviceSelect}
                        onBranchSelect={handleBranchSelect}
                    />
                    <div className="mb-4">
                        <label>
                            <input
                                type="checkbox"
                                checked={includeEnvVars}
                                onChange={(e) => setIncludeEnvVars(e.target.checked)}
                            />
                            <span className="ml-2">Include Environment Variables</span>
                        </label>
                    </div>

                    {includeEnvVars && (
                        <>
                            <div className="mb-4">
                                <label>Env Key:</label>
                                <input
                                    type="text"
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    value={envKey}
                                    onChange={(e) => setEnvKey(e.target.value)}
                                    placeholder="Environment Key"
                                />
                            </div>

                            <div className="mb-4">
                                <label>Env Value:</label>
                                <input
                                    type="text"
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    value={envValue}
                                    onChange={(e) => setEnvValue(e.target.value)}
                                    placeholder="Environment Value"
                                />
                            </div>
                        </>
                    )}
                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold p-3 rounded-lg hover:bg-gradient-to-br focus:outline-none focus:ring-4 focus:ring-blue-300 shadow-lg transition duration-200"
                    >
                        Trigger Pipeline
                    </button>
                </form>
            </div>
        </div>
    );
}

export default RunPage;