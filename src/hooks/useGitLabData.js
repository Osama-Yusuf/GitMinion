import { useState, useEffect } from 'react';

export const normalizeGitlabLink = (link) => {
    return link.endsWith('/') ? link.slice(0, -1) : link;
};

const useGitLabData = () => {
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [selectedMicroservice, setSelectedMicroservice] = useState(null);
    const [selectedBranch, setSelectedBranch] = useState(null);
    const [gitlabLink, setGitlabLink] = useState('');
    const [hasToken, setHasToken] = useState(false);

    useEffect(() => {
        const storedGitlabLink = localStorage.getItem('gitlabLink');
        if (storedGitlabLink) {
            setGitlabLink(normalizeGitlabLink(storedGitlabLink));
        }
    }, []);

    useEffect(() => {
        // Load access token and GitLab link from local storage if available
        const storedToken = localStorage.getItem('accessToken');
        const storedGitlabLink = localStorage.getItem('gitlabLink');
        if (storedToken && storedGitlabLink) {
            setGitlabLink(normalizeGitlabLink(storedGitlabLink));
            setHasToken(true);
        }
    }, []);

    const fetchGroups = async (inputValue) => {
        const accessToken = localStorage.getItem('accessToken');
        const gitlabApi = `${gitlabLink}/api/v4`;
        const headers = { 'PRIVATE-TOKEN': accessToken };

        try {
            const response = await fetch(`${gitlabApi}/groups?search=${inputValue}`, { headers });
            const data = await response.json();
            const groups = data.map(group => ({ label: group.name, value: group.id }));
            console.log("🚀 ~ fetchGroups ~ groups:", groups)

            return groups;
        } catch (error) {
            console.error('Error fetching groups:', error);
            return [];
        }
    };

    const fetchMicroservices = async (inputValue) => {
        if (!selectedGroup || !selectedGroup.value) return [];

        const accessToken = localStorage.getItem('accessToken');
        const gitlabApi = `${gitlabLink}/api/v4`;
        const headers = { 'PRIVATE-TOKEN': accessToken };

        try {
            const response = await fetch(`${gitlabApi}/groups/${selectedGroup.value}/projects?search=${inputValue}`, { headers });
            const data = await response.json();
            const microservices = data.map(project => ({ label: project.name, value: project.id }));
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

    return {
        selectedGroup, setSelectedGroup,
        selectedMicroservice, setSelectedMicroservice,
        selectedBranch, setSelectedBranch,
        gitlabLink, setGitlabLink,
        hasToken, setHasToken,
        fetchGroups, fetchMicroservices, fetchBranches
    };
};

export default useGitLabData;
