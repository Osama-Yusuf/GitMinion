import React from 'react';
import Inputs from '../components/Inputs';
import useGitLabData from '../hooks/useGitLabData';

function LinkPage() {
    const {
        selectedGroup, setSelectedGroup,
        selectedMicroservice, setSelectedMicroservice,
        selectedBranch, setSelectedBranch,
        gitlabLink,
    } = useGitLabData();
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const groupId = selectedGroup.value;
            console.log("🚀 ~ handleSubmit ~ groupId:", groupId)
            if (!groupId) throw new Error('Group ID not found');

            const projectId = selectedMicroservice.value;
            console.log("🚀 ~ handleSubmit ~ projectId:", projectId)
            if (!projectId) throw new Error('Project ID not found');

            const ciEditorUrl = `${gitlabLink}/${selectedGroup.label}/${selectedMicroservice.label}/-/ci/editor?branch_name=${selectedBranch.label}`;
            window.open(ciEditorUrl, '_blank');
            console.log("🚀 ~ handleSubmit ~ ciEditorUrl:", ciEditorUrl)
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

                    <h2 className="text-2xl font-bold mb-8 text-gray-800 text-center">Generate CI/CD Editor Link</h2>
                    <Inputs
                        onGroupSelect={handleGroupSelect}
                        onMicroserviceSelect={handleMicroserviceSelect}
                        onBranchSelect={handleBranchSelect}
                    />
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