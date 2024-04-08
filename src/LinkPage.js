import React, { useState, useEffect } from 'react';
import AsyncSelect from 'react-select/async';

function LinkPage() {
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [selectedMicroservice, setSelectedMicroservice] = useState(null);
    const [selectedBranch, setSelectedBranch] = useState(null);
    const [gitlabLink, setGitlabLink] = useState('');

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
    })

    const fetchGroups = async (inputValue) => {
        const accessToken = localStorage.getItem('accessToken');
        const gitlabApi = `${gitlabLink}/api/v4`;
        const headers = { 'PRIVATE-TOKEN': accessToken };

        try {
            const response = await fetch(`${gitlabApi}/groups?search=${inputValue}`, { headers });
            const data = await response.json();
            console.log("🚀 ~ fetchGroups ~ data:", data)
            const groups = data.map(group => ({ label: group.name, value: group.id }));
            console.log("🚀 ~ fetchGroups ~ groups:", groups)

            return data.map(group => ({ label: group.name, value: group.id }));
        } catch (error) {
            console.error('Error fetching groups:', error);
            return [];
        }
    };

    const fetchMicroservices = async (inputValue) => {
        console.log("🚀 ~ fetchMicroservices ~ selectedGroup.label:", selectedGroup.label)
        console.log("🚀 ~ fetchMicroservices ~ selectedGroup.value:", selectedGroup.value)

        if (!selectedGroup || !selectedGroup.value) return [];

        const accessToken = localStorage.getItem('accessToken');
        const gitlabApi = `${gitlabLink}/api/v4`;
        const headers = { 'PRIVATE-TOKEN': accessToken };

        try {
            const response = await fetch(`${gitlabApi}/groups/${selectedGroup.value}/projects?search=${inputValue}`, { headers });
            const data = await response.json();
            console.log("🚀 ~ fetchMicroservices ~ data:", data);
            const projectItems = data.map(project => ({ label: project.name, value: project.id }));
            console.log("Final options for Select:", projectItems);
            return projectItems;
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
            return data.map(branch => ({ label: branch.name, value: branch.name }));
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

        try {
            const groupId = selectedGroup.value;
            if (!groupId) throw new Error('Group ID not found');

            const projectId = selectedMicroservice.value;
            if (!projectId) throw new Error('Project ID not found');

            const ciEditorUrl = `${gitlabLink}/${selectedGroup.label}/${selectedMicroservice.label}/-/ci/editor?branch_name=${selectedBranch.label}`;
            window.open(ciEditorUrl, '_blank');
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

                    <h2 className="text-2xl font-bold mb-8 text-gray-800 text-center">Generate CI/CD Editor Link</h2>
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
                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold p-3 rounded-lg hover:bg-gradient-to-br focus:outline-none focus:ring-4 focus:ring-blue-300 shadow-lg transition duration-200"
                    >
                        Generate Link
                    </button>
                </form>
            </div>
        </div>
    );
}

export default LinkPage;