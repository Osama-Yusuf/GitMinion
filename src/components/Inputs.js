import React, { useEffect } from 'react';
import AsyncSelect from 'react-select/async';
import useGitLabData from '../hooks/useGitLabData';

function Inputs({ onGroupSelect, onMicroserviceSelect, onBranchSelect }) {

    const {
        selectedGroup, setSelectedGroup,
        selectedMicroservice, setSelectedMicroservice,
        setSelectedBranch,
        fetchGroups, fetchMicroservices, fetchBranches
    } = useGitLabData();

    useEffect(() => {
        if (selectedGroup && onGroupSelect) {
            onGroupSelect(selectedGroup);
        }
        if (selectedMicroservice && onMicroserviceSelect) {
            onMicroserviceSelect(selectedMicroservice);
        }
    }, [selectedGroup, selectedMicroservice, onGroupSelect, onMicroserviceSelect]);

    return (
        <>
            <div className="mb-4">
                <label>Group:</label>
                <AsyncSelect
                    cacheOptions
                    defaultOptions
                    loadOptions={fetchGroups}
                    onChange={setSelectedGroup} />
            </div>
            <div className="mb-4">
                <label>Microservice:</label>
                <AsyncSelect
                    cacheOptions
                    defaultOptions
                    loadOptions={fetchMicroservices}
                    onChange={setSelectedMicroservice}
                    isDisabled={!selectedGroup} />
            </div>
            <div className="mb-4">
                <label>Branch:</label>
                <AsyncSelect
                    cacheOptions
                    defaultOptions
                    loadOptions={fetchBranches}
                    onChange={(value) => {
                        setSelectedBranch(value);
                        if (onBranchSelect) {
                            onBranchSelect(value);
                        }
                    }}
                    isDisabled={!selectedMicroservice} />
            </div>
        </>
    );
}

export default Inputs;