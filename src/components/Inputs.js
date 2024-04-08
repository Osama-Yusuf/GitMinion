import React, { useEffect } from "react";
import AsyncSelect from "react-select/async";
import useGitLabData from "../hooks/useGitLabData";
import Select from "react-select";

function Inputs({ onGroupSelect, onMicroserviceSelect, onBranchSelect }) {
  const {
    selectedGroup,
    setSelectedGroup,
    selectedMicroservice,
    setSelectedMicroservice,
    setSelectedBranch,
    fetchGroups,
    fetchMicroservices,
    fetchBranches,
    microservices,
    branches,
    groups
  } = useGitLabData();

    useEffect(() => {
        if (selectedGroup && onGroupSelect) {
            onGroupSelect(selectedGroup);
        }
        if (selectedMicroservice && onMicroserviceSelect) {
            onMicroserviceSelect(selectedMicroservice);
        }
    }, [
        selectedGroup,
        selectedMicroservice,
        onGroupSelect,
        onMicroserviceSelect,
    ]);

  return (
    <>
      <div className="mb-4">
        <label>Group:</label>

        <Select options={groups} onChange={setSelectedGroup} />
      </div>
      <div className="mb-4">
        <label>Microservice:</label>
        <Select
          key={selectedGroup ? selectedGroup.value : "initial"} // Force re-render when selectedGroup changes
          options={microservices} // Use state-managed options
          onChange={setSelectedMicroservice}
          isDisabled={!microservices.length} // Disable select if no options are available
        />
      </div>
      <div className="mb-4">
        <label>Branch:</label>
        <Select
          key={selectedMicroservice ? selectedMicroservice.value : "initial"}
          options={branches}
          onChange={(value) => {
            setSelectedBranch(value);
            if (onBranchSelect) {
              onBranchSelect(value);
            }
          }}
          isDisabled={!selectedMicroservice}
        />
      </div>
    </>
  );
}

export default Inputs;
