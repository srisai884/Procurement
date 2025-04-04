/*

document.addEventListener('DOMContentLoaded', function() {
	
	const userId = sessionStorage.getItem('userId');
	let productDetailsData = [];

		
	    const searchButton = document.getElementById('searchButton');
	    searchButton.addEventListener('click', searchRequisitions);

	    // Fetch and populate dropdowns on page load
	    fetchDropdownData();

	    function fetchDropdownData() {
	        fetch('/api/requisitions/requestedBy')
	            .then(response => response.json())
	            .then(data => {
	                const requestedByDropdown = document.getElementById('requestedBy');
	                data.forEach(user => {
	                    const option = document.createElement('option');
	                    option.value = user;
	                    option.text = user;
	                    requestedByDropdown.appendChild(option);
	                });
	            });

	        fetch('/api/requisitions/requisitionIds')
	            .then(response => response.json())
	            .then(data => {
	                const requisitionIdDropdown = document.getElementById('requisitionId');
	                data.forEach(id => {
	                    const option = document.createElement('option');
	                    option.value = id;
	                    option.text = id;
	                    requisitionIdDropdown.appendChild(option);
	                });
	            });
	    }

		function hasProducts() {
			return productDetailsData.length > 0;
		}
		
		function hideTables() {
		    const resultsContainer = document.getElementById('resultsContainer');
		    const detailsContainer = document.getElementById('detailsContainer');
		    const resultsTable = document.getElementById('resultsTable');
		    const detailsTable = detailsContainer.querySelector('table');

		    resultsContainer.style.display = 'none';
		    detailsContainer.style.display = 'none';

		    if (resultsTable) {
		        resultsTable.innerHTML = ''; // Clear the table content
		    }

		    if (detailsTable) {
		        detailsTable.innerHTML = ''; // Clear the table content
		    }
			productDetailsData = []; // Clear the product details data
		}
		
	    function searchRequisitions() {
	        let requestedBy = document.getElementById('requestedBy').value;
	        let requisitionId = document.getElementById('requisitionId').value;
	        let requestedDate = document.getElementById('requestedDate').value;

	        // Handle default option values
	        if (requestedBy === 'Select Requested By') {
	            requestedBy = null;
	        }
	        if (requisitionId === 'Select Requisition ID') {
	            requisitionId = null;
	        }
	        if (requestedDate === '') {
	            requestedDate = null;
	        }

	        // Ensure at least one search criteria is provided
	        if (!requestedBy && !requisitionId && !requestedDate) {
				Swal.fire({
				    icon: 'error',
				    title: 'Error',
				    text: 'Please select at least one search criteria.'
				});
	            return;
	        }

	        // Build the query parameters
	        const params = new URLSearchParams();
	        if (requestedBy) params.append('requestedBy', requestedBy);
	        if (requisitionId) params.append('requisitionId', requisitionId);
	        if (requestedDate) params.append('requestedDate', requestedDate);
			console.log(params);

	        // Fetch the requisitions based on the search criteria
	        fetch(`/api/requisitions?${params.toString()}`)
	            .then(response => {
					console.log(response);
	                if (!response.ok) {
	                    throw new Error('Network response was not ok');
	                }
	                return response.json();
	            })
	            .then(data => {
	                if (!Array.isArray(data)) {
	                    throw new TypeError('Expected an array');
	                }
	                const resultsTable = document.getElementById('resultsTable');
					const resultsContainer = document.getElementById('resultsContainer');
					if (resultsTable) {
					    const tbody = resultsTable.getElementsByTagName('tbody')[0];
					    tbody.innerHTML = '';
						
						// Add caption to the table
						const caption = resultsTable.createCaption();
						caption.innerText = 'Purchase Requisitions';

	                    data.forEach(requisition => {
	                        const row = tbody.insertRow();
	                        row.insertCell(0).innerText = requisition.requisitionId;
	                        row.insertCell(1).innerText = requisition.requestedBy;
	                        row.insertCell(2).innerText = new Date(requisition.requestedDate).toLocaleDateString('en-GB'); // Format date
							row.insertCell(3).innerText = requisition.managerName;

							const viewDetailsCell = row.insertCell(4);
							const approveCell = row.insertCell(5);
							const rejectCell = row.insertCell(6);
	                        
	                        const viewDetailsButton = document.createElement('button');
	                        viewDetailsButton.innerText = 'View Details';
	                        viewDetailsButton.addEventListener('click', () => viewRequisitionDetails(requisition.requisitionId));
	                        viewDetailsCell.appendChild(viewDetailsButton);
	                        
	                        const approveButton = document.createElement('button');
	                        approveButton.innerText = 'Approve';
	                        approveButton.addEventListener('click', () 	=>	{
								    if (userId !== requisition.managerName) {
								        Swal.fire({
								            icon: 'error',
								            title: 'Error',
								            text: 'You are not authorized to approve this requisition.'
								        });
								    } else if (!hasProducts()) {
								        Swal.fire({
								            icon: 'error',
								            title: 'Error',
								            text: 'There are no products in the requisition.'
								        });
								    } else {
								        updateRequisitionStatus(requisition.requisitionId, 'Approved');
								    }
								});
	                        approveCell.appendChild(approveButton);
							

	                        const rejectButton = document.createElement('button');
	                        rejectButton.innerText = 'Reject';
	                        rejectButton.addEventListener('click', () =>  {
								    if (userId !== requisition.managerName) {
								        Swal.fire({
								            icon: 'error',
								            title: 'Error',
								            text: 'You are not authorized to reject this requisition.'
								        });
								    } else if (!hasProducts()) {
								        Swal.fire({
								            icon: 'error',
								            title: 'Error',
								            text: 'There are no products in the requisition.'
								        });
								    } else {
								        updateRequisitionStatus(requisition.requisitionId, 'Rejected');
								    }
								});
	                        rejectCell.appendChild(rejectButton);
	                    });

						resultsContainer.style.display = 'flex';
}
	            })
	            .catch(error => {
	                console.error('Error:', error);
	            });
	    }

	    function updateRequisitionStatus(requisitionId, status) {
	        fetch(`/api/requisitions/${requisitionId}/status/${status}`, {
	            method: 'PUT'
	        })
	        .then(response => response.json())
	        .then(data => {
				Swal.fire({
				    icon: 'success',
				    title: 'Success',
				    text: `Requisition ${requisitionId} has been ${status.toLowerCase()} successfully.`,
					showConfirmButton: true // Require user interaction to close the popup
				}).then(() => {
					
					   hideTables(); 
					   searchRequisitions();
						


					    // Add the requisition to the Approved/Rejected Requisitions table
					    const approvedRejectedTable = document.getElementById('approvedRejectedTable');
					    const approvedRejectedTbody = approvedRejectedTable.getElementsByTagName('tbody')[0];
					    const row = approvedRejectedTbody.insertRow();
					    row.insertCell(0).innerText = requisitionId;
					    row.insertCell(1).innerText = data.requestedBy;
					    row.insertCell(2).innerText = new Date(data.requestedDate).toLocaleDateString('en-GB');
					    row.insertCell(3).innerText = data.managerName;

					    const viewDetailsCell = row.insertCell(4);
					    const actionCell = row.insertCell(5);

					    const viewDetailsButton = document.createElement('button');
					    viewDetailsButton.innerText = 'View Details';
					    viewDetailsButton.addEventListener('click', () => viewRequisitionDetails(requisitionId));
					    viewDetailsCell.appendChild(viewDetailsButton);

					    actionCell.innerText = status;

					    // Display the Approved/Rejected Requisitions table if it's not already visible
					    const approvedRejectedContainer = document.getElementById('approvedRejectedContainer');
					    approvedRejectedContainer.style.display = 'flex';
			
						// Remove the requisition from the Purchase Requisitions table
						const resultsTable = document.getElementById('resultsTable');
						const tbody = resultsTable.getElementsByTagName('tbody')[0];
						const rows = tbody.rows;
						for (let i = 0; i < rows.length; i++) {
						    if (rows[i].cells[0].innerText === requisitionId) {
						        rows[i].remove();
						        break;
						    }
						}
						
						// Hide caption and headers if no rows are present
						if (tbody.rows.length === 0) {
						    resultsTable.caption.style.display = 'none';
						    resultsTable.thead.style.display = 'none';
						}



	        });
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
		

		function viewRequisitionDetails(requisitionId) {


		        fetch(`/api/requisitions/${requisitionId}/lines`)
		            .then(response => response.json())
		            .then(data => {
						productDetailsData = data; // Store the product details
						const productDetailsTable = `
						    <table class="details-table">
						        <thead>
						            <tr>
						                <th>Product Name</th>
						                <th>Quantity</th>
						                <th>Total</th>
						            </tr>
						        </thead>
						        <tbody>
						            ${data.map(line => `
						                <tr>
						                    <td>${line.productName}</td>
						                    <td>${line.quantity}</td>
						                    <td>${line.total}</td>
						                </tr>
						            `).join('')}
						        </tbody>
						    </table>
						`;


						    Swal.fire({
						        title: 'Product Details',
						        html: productDetailsTable,
						        width: '600px'
						    });
						})
					        .catch(error => {
					            console.error('Error:', error);
					            Swal.fire({
					                icon: 'error',
					                title: 'Error',
					                text: 'An error occurred while fetching requisition details. Please try again.'
					            });
					        });
					}
			});
			
*/

/*
document.addEventListener('DOMContentLoaded', function() {
    const userId = sessionStorage.getItem('userId');
    let productDetailsData = [];

    const searchButton = document.getElementById('searchButton');
    searchButton.addEventListener('click', searchRequisitions);

    // Fetch and populate dropdowns on page load
    fetchDropdownData();

    function fetchDropdownData() {
        fetch('/api/requisitions/requestedBy')
            .then(response => response.json())
            .then(data => {
                const requestedByDropdown = document.getElementById('requestedBy');
                data.forEach(user => {
                    const option = document.createElement('option');
                    option.value = user;
                    option.text = user;
                    requestedByDropdown.appendChild(option);
                });
            });

        fetch('/api/requisitions/requisitionIds')
            .then(response => response.json())
            .then(data => {
                const requisitionIdDropdown = document.getElementById('requisitionId');
                data.forEach(id => {
                    const option = document.createElement('option');
                    option.value = id;
                    option.text = id;
                    requisitionIdDropdown.appendChild(option);
                });
            });
    }

    function hasProducts() {
        return productDetailsData.length > 0;
    }

    function hideTables() {
        const resultsContainer = document.getElementById('resultsContainer');
        const detailsContainer = document.getElementById('detailsContainer');
        const resultsTable = document.getElementById('resultsTable');
        const detailsTable = detailsContainer.querySelector('table');

        resultsContainer.style.display = 'none';
        detailsContainer.style.display = 'none';

        if (resultsTable) {
            resultsTable.innerHTML = ''; // Clear the table content
        }

        if (detailsTable) {
            detailsTable.innerHTML = ''; // Clear the table content
        }
        productDetailsData = []; // Clear the product details data
    }

    function searchRequisitions() {
        let requestedBy = document.getElementById('requestedBy').value;
        let requisitionId = document.getElementById('requisitionId').value;
        let requestedDate = document.getElementById('requestedDate').value;

        // Handle default option values
        if (requestedBy === 'Select Requested By') {
            requestedBy = null;
        }
        if (requisitionId === 'Select Requisition ID') {
            requisitionId = null;
        }
        if (requestedDate === '') {
            requestedDate = null;
        }

        // Ensure at least one search criteria is provided
        if (!requestedBy && !requisitionId && !requestedDate) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Please select at least one search criteria.'
            });
            return;
        }

        // Build the query parameters
        const params = new URLSearchParams();
        if (requestedBy) params.append('requestedBy', requestedBy);
        if (requisitionId) params.append('requisitionId', requisitionId);
        if (requestedDate) params.append('requestedDate', requestedDate);
        console.log(params);

        // Fetch the requisitions based on the search criteria
        fetch(`/api/requisitions?${params.toString()}`)
            .then(response => {
                console.log(response);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                if (!Array.isArray(data) || data.length === 0) {
                    Swal.fire({
                        icon: 'info',
                        title: 'No Requisitions',
                        text: 'No requisitions available for the selected criteria.'
                    });
                    hideTables();
                    return;
                }

                const resultsTable = document.getElementById('resultsTable');
                const resultsContainer = document.getElementById('resultsContainer');
                if (resultsTable) {
                    const tbody = resultsTable.querySelector('tbody');
                    tbody.innerHTML = '';

                    // Add caption to the table
                    const caption = resultsTable.createCaption();
                    caption.innerText = 'Purchase Requisitions';

                    data.forEach(requisition => {
                        const row = tbody.insertRow();
                        row.insertCell(0).innerText = requisition.requisitionId;
                        row.insertCell(1).innerText = requisition.requestedBy;
                        row.insertCell(2).innerText = new Date(requisition.requestedDate).toLocaleDateString('en-GB'); // Format date
                        row.insertCell(3).innerText = requisition.managerName;

                        const viewDetailsCell = row.insertCell(4);
                        const approveCell = row.insertCell(5);
                        const rejectCell = row.insertCell(6);

                        const viewDetailsButton = document.createElement('button');
                        viewDetailsButton.innerText = 'View Details';
                        viewDetailsButton.addEventListener('click', () => viewRequisitionDetails(requisition.requisitionId));
                        viewDetailsCell.appendChild(viewDetailsButton);

                        const approveButton = document.createElement('button');
                        approveButton.innerText = 'Approve';
                        approveButton.addEventListener('click', () => {
                            if (userId !== requisition.managerName) {
                                Swal.fire({
                                    icon: 'error',
                                    title: 'Error',
                                    text: 'You are not authorized to approve this requisition.'
                                });
                            } else if (!hasProducts()) {
                                Swal.fire({
                                    icon: 'error',
                                    title: 'Error',
                                    text: 'There are no products in the requisition.'
                                });
                            } else {
                                updateRequisitionStatus(requisition.requisitionId, 'Approved');
                            }
                        });
                        approveCell.appendChild(approveButton);

                        const rejectButton = document.createElement('button');
                        rejectButton.innerText = 'Reject';
                        rejectButton.addEventListener('click', () => {
                            if (userId !== requisition.managerName) {
                                Swal.fire({
                                    icon: 'error',
                                    title: 'Error',
                                    text: 'You are not authorized to reject this requisition.'
                                });
                            } else if (!hasProducts()) {
                                Swal.fire({
                                    icon: 'error',
                                    title: 'Error',
                                    text: 'There are no products in the requisition.'
                                });
                            } else {
                                updateRequisitionStatus(requisition.requisitionId, 'Rejected');
                            }
                        });
                        rejectCell.appendChild(rejectButton);
                    });

                    resultsContainer.style.display = 'flex';
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    function updateRequisitionStatus(requisitionId, status) {
        fetch(`/api/requisitions/${requisitionId}/status/${status}`, {
            method: 'PUT'
        })
        .then(response => response.json())
        .then(data => {
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: `Requisition ${requisitionId} has been ${status.toLowerCase()} successfully.`,
                showConfirmButton: true // Require user interaction to close the popup
            }).then(() => {
                // Remove the requisition from the Purchase Requisitions table
                const resultsTable = document.getElementById('resultsTable');
                const tbody = resultsTable.querySelector('tbody');
                const rows = tbody.rows;
                for (let i = 0; i < rows.length; i++) {
                    if (rows[i].cells[0].innerText === requisitionId) {
                        rows[i].remove();
                        break;
                    }
                }

                // Hide caption and headers if no rows are present
                if (tbody.rows.length === 0) {
                    resultsTable.caption.style.display = 'none';
                    resultsTable.tHead.style.display = 'none';
                }

                // Add the requisition to the Approved/Rejected Requisitions table
                const approvedRejectedTable = document.getElementById('approvedRejectedTable');
                const approvedRejectedTbody = approvedRejectedTable.querySelector('tbody');
                const row = approvedRejectedTbody.insertRow();
                row.insertCell(0).innerText = requisitionId;
                row.insertCell(1).innerText = data.requestedBy;
                row.insertCell(2).innerText = new Date(data.requestedDate).toLocaleDateString('en-GB');
                row.insertCell(3).innerText = data.managerName;

                const viewDetailsCell = row.insertCell(4);
                const actionCell = row.insertCell(5);

                const viewDetailsButton = document.createElement('button');
                viewDetailsButton.innerText = 'View Details';
                viewDetailsButton.addEventListener('click', () => viewRequisitionDetails(requisitionId));
                viewDetailsCell.appendChild(viewDetailsButton);

                actionCell.innerText = status;
				                // Display the Approved/Rejected Requisitions table if it's not already visible
				                const approvedRejectedContainer = document.getElementById('approvedRejectedContainer');
				                approvedRejectedContainer.style.display = 'flex';

				                // Ensure the Purchase Requisitions table stays visible if there are remaining rows
				                const resultsContainer = document.getElementById('resultsContainer');
				                if (tbody.rows.length > 0) {
				                    resultsContainer.style.display = 'flex';
				                } else {
				                    resultsContainer.style.display = 'none';
				                }
				            });
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

				    function viewRequisitionDetails(requisitionId) {
				        fetch(`/api/requisitions/${requisitionId}/lines`)
				            .then(response => response.json())
				            .then(data => {
				                productDetailsData = data; // Store the product details
				                const productDetailsTable = `
				                    <table class="details-table">
				                        <thead>
				                            <tr>
				                                <th>Product Name</th>
				                                <th>Quantity</th>
				                                <th>Total</th>
				                            </tr>
				                        </thead>
				                        <tbody>
				                            ${data.map(line => `
				                                <tr>
				                                    <td>${line.productName}</td>
				                                    <td>${line.quantity}</td>
				                                    <td>${line.total}</td>
				                                </tr>
				                            `).join('')}
				                        </tbody>
				                    </table>
				                `;

				                Swal.fire({
				                    title: 'Product Details',
				                    html: productDetailsTable,
				                    width: '600px'
				                });
				            })
				            .catch(error => {
				                console.error('Error:', error);
				                Swal.fire({
				                    icon: 'error',
				                    title: 'Error',
				                    text: 'An error occurred while fetching requisition details. Please try again.'
				                });
				            });
				    }
				});
*/

document.addEventListener('DOMContentLoaded', function() {
    const userId = sessionStorage.getItem('userId');
    let productDetailsData = [];
	
	const selectedRequisitionId = sessionStorage.getItem('selectedRequisitionId');
	if (selectedRequisitionId) {
	    const requisitionDropdown = document.getElementById('requisitionId');
	    const option = document.createElement('option');
	    option.value = selectedRequisitionId;
	    option.text = selectedRequisitionId;
	    option.selected = true;
	    requisitionDropdown.add(option);
	}

    const searchButton = document.getElementById('searchButton');
    searchButton.addEventListener('click', searchRequisitions);

    // Fetch and populate dropdowns on page load
    fetchDropdownData();

    function fetchDropdownData() {
        fetch('/api/requisitions/requestedBy')
            .then(response => response.json())
            .then(data => {
                const requestedByDropdown = document.getElementById('requestedBy');
                data.forEach(user => {
                    const option = document.createElement('option');
                    option.value = user;
                    option.text = user;
                    requestedByDropdown.appendChild(option);
                });
            });

        fetch('/api/requisitions/requisitionIds')
            .then(response => response.json())
            .then(data => {
                const requisitionIdDropdown = document.getElementById('requisitionId');
                data.forEach(id => {
					console.log(id);
					if (id !== selectedRequisitionId) {
                    const option = document.createElement('option');
                    option.value = id;
                    option.text = id;
                    requisitionIdDropdown.appendChild(option);
					}
                });
				
            });
    }

    function hasProducts() {
        return productDetailsData.length > 0;
    }

    function hideTables() {
        const resultsContainer = document.getElementById('resultsContainer');
        const detailsContainer = document.getElementById('detailsContainer');
        const resultsTable = document.getElementById('resultsTable');
        const detailsTable = detailsContainer.querySelector('table');

        resultsContainer.style.display = 'none';
        detailsContainer.style.display = 'none';

        if (resultsTable) {
            resultsTable.innerHTML = ''; // Clear the table content
        }

        if (detailsTable) {
            detailsTable.innerHTML = ''; // Clear the table content
        }
        productDetailsData = []; // Clear the product details data
    }

    function searchRequisitions() {
        let requestedBy = document.getElementById('requestedBy').value;
        let requisitionId = document.getElementById('requisitionId').value;
        let requestedDate = document.getElementById('requestedDate').value;

        // Handle default option values
        if (requestedBy === 'Select Requested By') {
            requestedBy = null;
        }
        if (requisitionId === 'Select Requisition ID') {
            requisitionId = null;
        }
        if (requestedDate === '') {
            requestedDate = null;
        }

        // Ensure at least one search criteria is provided
        if (!requestedBy && !requisitionId && !requestedDate) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Please select at least one search criteria.'
            });
            return;
        }

        // Build the query parameters
        const params = new URLSearchParams();
        if (requestedBy) params.append('requestedBy', requestedBy);
        if (requisitionId) params.append('requisitionId', requisitionId);
        if (requestedDate) params.append('requestedDate', requestedDate);
        console.log(params);

        // Fetch the requisitions based on the search criteria
        fetch(`/api/requisitions?${params.toString()}`)
            .then(response => {
                console.log(response);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                if (!Array.isArray(data) || data.length === 0) {
                    Swal.fire({
                        icon: 'info',
                        title: 'No Requisitions',
                        text: 'No requisitions available for the selected criteria.'
                    });
                    hideTables();
                    return;
                }

                const resultsTable = document.getElementById('resultsTable');
                const resultsContainer = document.getElementById('resultsContainer');
                if (resultsTable) {
                    const tbody = resultsTable.querySelector('tbody');
                    tbody.innerHTML = '';

                    // Add caption to the table

                    data.forEach(requisition => {
                        const row = tbody.insertRow();
                        row.insertCell(0).innerText = requisition.requisitionId;
                        row.insertCell(1).innerText = requisition.requestedBy;
						row.insertCell(2).innerText = new Date(requisition.requestedDate).toLocaleDateString('en-GB'); // Format date
						row.insertCell(3).innerText = new Date(requisition.expectedDate).toLocaleDateString('en-GB'); // Format date
                        row.insertCell(4).innerText = requisition.managerName;
						row.insertCell(5).innerText = requisition.vendorName;


                        const viewDetailsCell = row.insertCell(6);
                        const approveCell = row.insertCell(7);
                        const rejectCell = row.insertCell(8);

                        const viewDetailsButton = document.createElement('button');
                        viewDetailsButton.innerText = 'View Details';
						viewDetailsButton.className = 'view-details-button'; 
                        viewDetailsButton.addEventListener('click', () => viewRequisitionDetails(requisition.requisitionId));
                        viewDetailsCell.appendChild(viewDetailsButton);

                        const approveButton = document.createElement('button');
                        approveButton.innerText = 'Approve';
						approveButton.className = 'approve-button'; 
                        approveButton.addEventListener('click', () => {
                            if (userId !== requisition.managerName) {
                                Swal.fire({
                                    icon: 'error',
                                    title: 'Error',
                                    text: 'You are not authorized to approve this requisition.'
                                });
                            } else if (!hasProducts()) {
                                Swal.fire({
                                    icon: 'error',
                                    title: 'Error',
                                    text: 'There are no products in the requisition.'
                                });
                            } else {
                                updateRequisitionStatus(requisition.requisitionId, 'Approved');
                            }
                        });
                        approveCell.appendChild(approveButton);

                        const rejectButton = document.createElement('button');
                        rejectButton.innerText = 'Reject';
						rejectButton.className = 'reject-button'; 
                        rejectButton.addEventListener('click', () => {
                            if (userId !== requisition.managerName) {
                                Swal.fire({
                                    icon: 'error',
                                    title: 'Error',
                                    text: 'You are not authorized to reject this requisition.'
                                });
                            } else if (!hasProducts()) {
                                Swal.fire({
                                    icon: 'error',
                                    title: 'Error',
                                    text: 'There are no products in the requisition.'
                                });
                            } else {
                                updateRequisitionStatus(requisition.requisitionId, 'Rejected');
                            }
                        });
                        rejectCell.appendChild(rejectButton);
                    });

                    resultsContainer.style.display = 'flex';
					
					document.getElementById('resultsContainer').scrollIntoView({ behavior: 'smooth' });

                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    function updateRequisitionStatus(requisitionId, status) {
        fetch(`/api/requisitions/${requisitionId}/status/${status}`, {
            method: 'PUT'
        })
        .then(response => response.json())
        .then(data => {
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: `Requisition ${requisitionId} has been ${status.toLowerCase()} successfully.`,
                showConfirmButton: true // Require user interaction to close the popup
            }).then(() => {
                // Remove the requisition from the Purchase Requisitions table
                const resultsTable = document.getElementById('resultsTable');
                const tbody = resultsTable.querySelector('tbody');
                const rows = tbody.rows;
                for (let i = 0; i < rows.length; i++) {
                    if (rows[i].cells[0].innerText === requisitionId) {
                        rows[i].remove();
                        break;
                    }
                }

                // Hide caption and headers if no rows are present
                if (tbody.rows.length === 0) {
                    resultsTable.caption.style.display = 'none';
                    resultsTable.tHead.style.display = 'none';
                }

                // Add the requisition to the Approved/Rejected Requisitions table
                const approvedRejectedTable = document.getElementById('approvedRejectedTable');
                const approvedRejectedTbody = approvedRejectedTable.querySelector('tbody');
                const row = approvedRejectedTbody.insertRow();
                row.insertCell(0).innerText = requisitionId;
                row.insertCell(1).innerText = data.requestedBy;
				row.insertCell(2).innerText = new Date(data.requestedDate).toLocaleDateString('en-GB');
                row.insertCell(3).innerText = new Date(data.expectedDate).toLocaleDateString('en-GB');
                row.insertCell(4).innerText = data.managerName;
				row.insertCell(5).innerText = data.vendorName;


                const viewDetailsCell = row.insertCell(6);
                const actionCell = row.insertCell(7);

                const viewDetailsButton = document.createElement('button');
                viewDetailsButton.innerText = 'View Details';
				viewDetailsButton.className = 'view-details-button'; 
                viewDetailsButton.addEventListener('click', () => viewRequisitionDetails(requisitionId));
                viewDetailsCell.appendChild(viewDetailsButton);

                actionCell.innerText = status;

                // Display the Approved/Rejected Requisitions table if it's not already visible
                const approvedRejectedContainer = document.getElementById('approvedRejectedContainer');
                approvedRejectedContainer.style.display = 'flex';
				                // Ensure the Purchase Requisitions table stays visible if there are remaining rows
				                const resultsContainer = document.getElementById('resultsContainer');
				                if (tbody.rows.length > 0) {
				                    resultsContainer.style.display = 'flex';
				                } else {
				                    resultsContainer.style.display = 'none';
				                }
				            });
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

				    function viewRequisitionDetails(requisitionId) {
				        fetch(`/api/requisitions/${requisitionId}/lines`)
				            .then(response => response.json())
				            .then(data => {
				                productDetailsData = data; // Store the product details
				                const productDetailsTable = `
				                    <table class="details-table">
				                        <thead>
				                            <tr>
				                                <th>Product Name</th>
				                                <th>Quantity</th>
				                                <th>Total</th>
				                            </tr>
				                        </thead>
				                        <tbody>
				                            ${data.map(line => `
				                                <tr>
				                                    <td>${line.productName}</td>
				                                    <td>${line.quantity}</td>
				                                    <td>${line.total}</td>
				                                </tr>
				                            `).join('')}
				                        </tbody>
				                    </table>
				                `;

				                Swal.fire({
				                    title: 'Product Details',
				                    html: productDetailsTable,
				                    width: '600px'
				                });
				            })
				            .catch(error => {
				                console.error('Error:', error);
				                Swal.fire({
				                    icon: 'error',
				                    title: 'Error',
				                    text: 'An error occurred while fetching requisition details. Please try again.'
				                });
				            });
				    }
				});