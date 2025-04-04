document.addEventListener('DOMContentLoaded', function() {
    const userId = sessionStorage.getItem('userId');
	console.log(userId);
    document.getElementById('requestedBy').value = userId;

    // Set today's date as the requested date
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('requestedDate').value = today;

    // Fetch the logged-in user's details to get the managerId
    fetch(`/api/users/${userId}`)
        .then(response => response.json())
        .then(user => {
            const managerId = user.managerId;
            if (managerId) {
                // Fetch the manager's details
                fetch(`/api/users/${managerId}`)
                    .then(response => response.json())
                    .then(manager => {
						console.log(manager.userId);

						document.getElementById('managerId').value = manager.userId;

                    });
            }
        });

    // Fetch vendors
    fetch('/api/vendors')
        .then(response => response.json())
        .then(data => {
			console.log(data);
            const vendorSelect = document.getElementById('vendorName');
			console.log(vendorSelect);
            data.forEach(vendor => {
                const option = document.createElement('option');
                option.value = vendor.vendorName;
                option.textContent = vendor.vendorName;
                vendorSelect.appendChild(option);
            });
        });
});



function saveRequisition() {
	if (validateForm()) {

    const requisition = getRequisitionData();
    requisition.status = 'Draft';
	console.log('Saving requisition:', requisition);
    sendRequisition(requisition, 'saved');
	
	console.log('Requisition ID after save:', document.getElementById('requisitionId').value);
	document.getElementById('requisitionTableContainer').scrollIntoView({ behavior: 'smooth' });

	}
}

function submitRequisition() {
	if (validateForm()) {
    const requisition = getRequisitionData();
    requisition.status = 'Submitted';
	console.log('Submitting requisition:', requisition);
    sendRequisition(requisition, 'submitted');
	
	

	// Reset specific fields to their default values
	    document.getElementById('expectedDate').value = '';
	    document.getElementById('managerId').selectedIndex = 0;
	    document.getElementById('vendorName').selectedIndex = 0;	
		document.getElementById('requisitionId').value = ''; // Clear the requisitionId field
		document.getElementById('status').value = 'Draft'; // Clear the status field
		
		console.log('Requisition ID after submit:', document.getElementById('requisitionId').value);	
		document.getElementById('requisitionTableContainer').scrollIntoView({ behavior: 'smooth' });

	}
}

	

function validateForm() {
    const requestedDate = document.getElementById('requestedDate').value;
    const expectedDate = document.getElementById('expectedDate').value;
    const managerId = document.getElementById('managerId').value;
    const vendorName = document.getElementById('vendorName').value;
	
    if (!requestedDate || !expectedDate || managerId === 'Select Manager' || vendorName === 'Select Vendor') {
		    Swal.fire({
		        icon: 'error',
		        title: 'Error',
		        text: 'Please fill in all required fields.'
		    });
		    return false;
    }
	if (new Date(expectedDate) <= new Date(requestedDate)) {
		        Swal.fire({
		            icon: 'error',
		            title: 'Error',
		            text: 'Expected date must be greater than the requested date.'
		        });
		        return false;
		    }

		    return true;
		}

function getRequisitionData() {
	let requisitionId = document.getElementById('requisitionId').value;
	console.log('Hi:',requisitionId);
    return {
        requisitionId: requisitionId ? requisitionId : null,
        requestedBy: document.getElementById('requestedBy').value,
        requestedDate: document.getElementById('requestedDate').value,
        expectedDate: document.getElementById('expectedDate').value,
        managerName: document.getElementById('managerId').value,
        vendorName: document.getElementById('vendorName').value,
        status: document.getElementById('status').value
    };
}

function sendRequisition(requisition, action) {
    fetch('/api/requisitions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requisition)
    })
    .then(response => response.json())
    .then(data => {
		console.log('Requisition response:', data);
		if (action === 'saved') {
			Swal.fire({
			    icon: 'success',
			    title: 'Success',
			    html: `Requisition saved successfully <br> ${data.requisitionId}`,
			});
		         document.getElementById('requisitionId').value = data.requisitionId; 
				 displayRequisitionTable({
				     ...requisition,
				     requisitionId: data.requisitionId,
					 status: 'Draft' // Ensure status is set to Draft
				 });
				 updateTableRow({
				     ...requisition,
					 requisitionId: data.requisitionId,
					 status: 'Draft' // Ensure status is set to Draft
				 });

		     } else if (action === 'submitted'	) {
				Swal.fire({
				    icon: 'success',
				    title: 'Success',
				    html: `Requisition submitted successfully <br> ${data.requisitionId}`,

				});
				 // Store requisitionId in sessionStorage
			/*	 document.getElementById('requisitionId').value = data.requisitionId; */
				 displayRequisitionTable({
				     ...requisition,
				     requisitionId: data.requisitionId,
					 status: 'Submitted' // Ensure status is set to Submitted
				 });
				 updateTableRow({
				     ...requisition,
					 requisitionId: data.requisitionId,
				     status: 'Submitted'
				 });		     
			 }
			 console.log('Requisition ID after send:', document.getElementById('requisitionId').value);
			 document.getElementById('requisitionTableContainer').scrollIntoView({ behavior: 'smooth' });

			 })
    .catch(error => {
        console.error('Error:', error);
		Swal.fire({
		    icon: 'error',
		    title: 'Error',
		    text: 'An error occurred. Please try again.',

		});
	    });
}
function displayRequisitionTable(requisition) {
    const tableContainer = document.getElementById('requisitionTableContainer');
    const tableBody = document.getElementById('requisitionTable').getElementsByTagName('tbody')[0];

	// Check if the requisition already exists in the table
	for (let row of tableBody.rows) {
	    if (row.cells[0].textContent === requisition.requisitionId) {
	        return; // Requisition already exists, do not add a new row
	    }
	}
    // Create a new row
    const newRow = tableBody.insertRow();

    // Add cells to the row
    newRow.insertCell(0).textContent = requisition.requisitionId;
    newRow.insertCell(1).textContent = requisition.requestedBy;
    newRow.insertCell(2).textContent = new Date(requisition.requestedDate).toLocaleDateString('en-GB');
    newRow.insertCell(3).textContent = new Date(requisition.expectedDate).toLocaleDateString('en-GB');
    newRow.insertCell(4).textContent = requisition.managerName;
    newRow.insertCell(5).textContent = requisition.vendorName;
    newRow.insertCell(6).textContent = requisition.status;
	
	console.log('Displaying requisition in table:', requisition);

    // Add action cell with anchor tag
    const actionCell = newRow.insertCell(7);
    const actionButton = document.createElement('button');
    actionButton.textContent = 'Add';
	actionButton.classList.add('add-button');
	actionButton.addEventListener('click', function() {
	    if (requisition.status === 'Submitted') {
	        sessionStorage.setItem('selectedRequisitionId', requisition.requisitionId);
	        window.location.href = '/requisitionlines'; // Adjust the URL to your second module
	    } else {
	        Swal.fire({
	            icon: 'error',
	            title: 'Error',
	            text: 'You cannot add products to this requisition.'
	        });
	    }
	});
	actionCell.appendChild(actionButton);
	
	// Add delete button cell
	const deleteCell = newRow.insertCell(8);
	const deleteButton = document.createElement('button');
	deleteButton.textContent = 'Delete';
	deleteButton.classList.add('delete-button');	
	deleteButton.addEventListener('click', function() {
	deleteRequisition(requisition.requisitionId, newRow);
	});
	deleteCell.appendChild(deleteButton);

    // Make the table visible
    tableContainer.style.display = 'block';
	document.getElementById('requisitionTableContainer').scrollIntoView({ behavior: 'smooth' });

}

	function updateTableRow(requisition) {
	    const tableBody = document.getElementById('requisitionTable').getElementsByTagName('tbody')[0];
	    for (let row of tableBody.rows) {
	        if (row.cells[0].textContent === requisition.requisitionId) {
	            row.cells[1].textContent = requisition.requestedBy;
	            row.cells[2].textContent = new Date(requisition.requestedDate).toLocaleDateString('en-GB');
	            row.cells[3].textContent = new Date(requisition.expectedDate).toLocaleDateString('en-GB');
	            row.cells[4].textContent = requisition.managerName;
	            row.cells[5].textContent = requisition.vendorName;
	            row.cells[6].textContent = requisition.status;
				
				            console.log('Updating table row:', requisition);

				            // Update action cell with anchor tag
				            const actionCell = row.cells[7];
				            actionCell.innerHTML = ''; // Clear existing content
				            const actionButton = document.createElement('button');
				            actionButton.textContent = 'Add';
				            actionButton.classList.add('add-button');
				            actionButton.addEventListener('click', function() {
				                if (requisition.status === 'Submitted') {
									sessionStorage.setItem('selectedRequisitionId', requisition.requisitionId);
				                    window.location.href = '/requisitionlines'; // Adjust the URL to your second module
				                } else {
				                    Swal.fire({
				                        icon: 'error',
				                        title: 'Error',
				                        text: 'You cannot add products to this requisition.'
				                    });
				                }
				            });
				            actionCell.appendChild(actionButton);
							document.getElementById('requisitionTableContainer').scrollIntoView({ behavior: 'smooth' });


				            break;
				        }
				    }


				}
	
	
	
	function deleteRequisition(requisitionId, row) {
	    fetch(`/api/requisitions/${requisitionId}`, {
	        method: 'DELETE'
	    })
	    .then(response => {
	        if (response.ok) {
	            row.remove();
	            checkTableVisibility();
	            Swal.fire({
	                icon: 'success',
	                title: 'Success',
	                text: 'Requisition deleted successfully.',
					showConfirmButton: true // Require user interaction to close the popup
	
	            });
	        } else {
	            Swal.fire({
	                icon: 'error',
	                title: 'Error',
	                text: 'Failed to delete requisition.',
					showConfirmButton: true // Require user interaction to close the popup
	
	            });
	        }
	    })
	    .catch(error => {
	        console.error('Error:', error);
	        Swal.fire({
	            icon: 'error',
	            title: 'Error',
	            text: 'An error occurred. Please try again.',
				showConfirmButton: true // Require user interaction to close the popup
	
	        });
	    });
	}
	
	function checkTableVisibility() {
	    const tableBody = document.getElementById('requisitionTable').getElementsByTagName('tbody')[0];
	    const tableContainer = document.getElementById('requisitionTableContainer');
	    if (tableBody.rows.length === 0) {
	        tableContainer.style.display = 'none';
	    }
	}
	
	function cancelRequisition() {
	    window.location.href = '/admin';
	}
	


