import React, { useState, useEffect } from 'react';
import AsyncSelect from 'react-select/async';

function RunPage() {
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [selectedMicroservice, setSelectedMicroservice] = useState(null);
    const [selectedBranch, setSelectedBranch] = useState(null);
    const [gitlabLink, setGitlabLink] = useState('');
    const [envKey, setEnvKey] = useState('ENV');
    const [envValue, setEnvValue] = useState('');
    const [includeEnvVars, setIncludeEnvVars] = useState(false);

    // State to check if the access token is available
    const [hasToken, setHasToken] = useState(false);

    useEffect(() => {
        // Load access token and GitLab link from local storage if available
        const storedToken = localStorage.getItem('accessToken');
        const storedGitlabLink = localStorage.getItem('gitlabLink');
        if (storedToken && storedGitlabLink) {
            setGitlabLink(normalizeGitlabLink(storedGitlabLink));
            setHasToken(true);
        }
    }, []);

    // create a use effect for selected group
    useEffect(() => {
        if (selectedGroup) {
            fetchMicroservices('');
        }
        if (selectedMicroservice) {
            fetchBranches('');
        }
    })

    const fetchGroups = async (inputValue) => {
        const accessToken = localStorage.getItem('accessToken');
        const gitlabApi = `${gitlabLink}/api/v4`;
        const headers = { 'PRIVATE-TOKEN': accessToken };

        try {
            const response = await fetch(`${gitlabApi}/groups?search=${inputValue}`, { headers });
            const data = await response.json();
            const groups = data.map(group => ({ label: group.name, value: group.id }));
            // console.log("🚀 ~ fetchGroups ~ data:", data)
            console.log("🚀 ~ fetchGroups ~ groups:", groups)

            return groups;
        } catch (error) {
            console.error('Error fetching groups:', error);
            return [];
        }
    };

    const fetchMicroservices = async (inputValue) => {
        // console.log("🚀 ~ fetchMicroservices ~ selectedGroup.label:", selectedGroup.label)
        // console.log("🚀 ~ fetchMicroservices ~ selectedGroup.value:", selectedGroup.value)

        if (!selectedGroup || !selectedGroup.value) return [];

        const accessToken = localStorage.getItem('accessToken');
        const gitlabApi = `${gitlabLink}/api/v4`;
        const headers = { 'PRIVATE-TOKEN': accessToken };

        try {
            const response = await fetch(`${gitlabApi}/groups/${selectedGroup.value}/projects?search=${inputValue}`, { headers });
            const data = await response.json();
            const microservices = data.map(project => ({ label: project.name, value: project.id }));
            // console.log("🚀 ~ fetchMicroservices ~ data:", data);
            console.log("🚀 ~ fetchMicroservices ~ microservices:", microservices)

            return microservices;
        } catch (error) {
            console.error('Error fetching microservices:', error);
            return [];
        }
    };

    const fetchBranches = async (inputValue) => {
        if (!selectedMicroservice) return [];
        const accessToken = localStorage.getItem('accessToken');
        const gitlabApi = `${gitlabLink}/api/v4`;
        const headers = { 'PRIVATE-TOKEN': accessToken };

        try {
            const response = await fetch(`${gitlabApi}/projects/${selectedMicroservice.value}/repository/branches?search=${inputValue}`, { headers });
            const data = await response.json();
            const branches = data.map(branch => ({ label: branch.name, value: branch.name }));
            console.log("🚀 ~ fetchBranches ~ branches:", branches)
            return branches;
        } catch (error) {
            console.error('Error fetching branches:', error);
            return [];
        }
    };

    const normalizeGitlabLink = (link) => {
        return link.endsWith('/') ? link.slice(0, -1) : link;
    };

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


    if (!hasToken) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p>Please enter your personal access token in the settings.</p>
            </div>
        );
    }

    return (
        <div className="App bg-gradient-to-r from-blue-500 to-purple-600 min-h-screen flex items-center justify-center">
            <div className="bg-white p-10 rounded-lg shadow-lg min-w-[400px]">
                <form onSubmit={handleSubmit} className="bg-white p-10 rounded-lg shadow-lg min-w-[400px]">

                    <h2 className="text-2xl font-bold mb-8 text-gray-800 text-center">Run GitLab Pipeline</h2>
                    <div className="mb-4">
                        <label>Group:</label>
                        <AsyncSelect
                            cacheOptions
                            defaultOptions
                            loadOptions={fetchGroups}
                            onChange={setSelectedGroup}
                        />
                    </div>
                    <div className="mb-4">
                        <label>Microservice:</label>
                        <AsyncSelect
                            cacheOptions
                            defaultOptions
                            loadOptions={fetchMicroservices}
                            onChange={setSelectedMicroservice}
                            isDisabled={!selectedGroup}
                        />
                    </div>
                    <div className="mb-4">
                        <label>Branch:</label>
                        <AsyncSelect
                            cacheOptions
                            defaultOptions
                            loadOptions={fetchBranches}
                            onChange={setSelectedBranch}
                            isDisabled={!selectedMicroservice}
                        />
                    </div>
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