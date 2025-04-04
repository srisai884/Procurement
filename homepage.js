// Placeholder for any future JavaScript functionality
// For now, navigation is handled by anchor tags in the HTML

// Example: Dynamic greeting based on time of day
window.addEventListener('DOMContentLoaded', () => {


    const greeting = document.querySelector('.intro h2');
    const hour = new Date().getHours();
    let message = 'Welcome to the Procurement Dashboard';

    if (hour < 12) {
        message = 'Good Morning! ' + message;
    } else if (hour < 18) {
        message = 'Good Afternoon! ' + message;
    } else {
        message = 'Good Evening! ' + message;
    }

    greeting.textContent = message;
});

document.getElementById('displayRequisitions').addEventListener('click', () => {
	const table = document.getElementById('requisitionsTable');
	const button = document.getElementById('displayRequisitions');
	if (table.style.display === 'none' || table.style.display === '') {
	    const userId = sessionStorage.getItem('userId');
	    const role = sessionStorage.getItem('role');
	let url = '/api/requisition';
	if (role === 'ADMIN') {
	    url = `/api/requisition?requestedBy=${userId}`;
	}
    fetch(url)
        .then(response => response.json())
        .then(data => {
			
			const statusOrder = ['Submitted', 'Draft', 'Approved', 'Rejected'];
			data.sort((a, b) => statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status));
			
            const tableBody = document.querySelector('#requisitionsTable tbody');
            tableBody.innerHTML = '';
            data.forEach(requisition => {
				const requestedDate = new Date(requisition.requestedDate);
				const formattedreqDate = `${requestedDate.getDate().toString().padStart(2, '0')}-${(requestedDate.getMonth() + 1).toString().padStart(2, '0')}-${requestedDate.getFullYear()}`;                
				const expectedDate = new Date(requisition.expectedDate);
				const formattedexpDate = `${expectedDate.getDate().toString().padStart(2, '0')}-${(expectedDate.getMonth() + 1).toString().padStart(2, '0')}-${expectedDate.getFullYear()}`;                
				const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${requisition.requisitionId}</td>
                    <td>${requisition.requestedBy}</td>
					<td>${formattedreqDate}</td>
					<td>${formattedexpDate}</td>
                    <td>${requisition.managerName}</td>
                    <td>${requisition.vendorName}</td>
                    <td>${requisition.status}</td>
                `;
                tableBody.appendChild(row);
				
				// Add action cell with anchor tag only for admin
				if (role === 'ADMIN') {
				    const actionCell = row.insertCell(7); // Adjust the index as needed
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
				}
				
				if (role === 'MANAGER') {
				// Update action cell with anchor tag
				console.log(requisition.managerName);
				console.log(userId);
				const actionCell = row.insertCell(7); // Adjust the index as needed
				const actionButton = document.createElement('button');
				actionButton.textContent = 'Action';
				actionButton.classList.add('add-button');
				actionButton.addEventListener('click', function() {
					if (userId != requisition.managerName){
						Swal.fire({
						    icon: 'warning',
						    title: 'warning',
						    text: 'You are not allowed.'
						});
					}
				    else if (requisition.status === 'Submitted' && userId == requisition.managerName) {
				        sessionStorage.setItem('selectedRequisitionId', requisition.requisitionId);
				        window.location.href = '/apporrej'; // Adjust the URL to your second module
				    } else if(requisition.status === 'Approved' && userId == requisition.managerName){
				        Swal.fire({
				            icon: 'error',
				            title: 'Error',
				            text: 'Requisition already Approved.'
				        });
				    }
					else if(requisition.status === 'Rejected' && userId == requisition.managerName){
						    Swal.fire({
						        icon: 'error',
						        title: 'Error',
						        text: 'Requisition already Rejected.'
						    });
						}
					else{
						Swal.fire({
						    icon: 'error',
						    title: 'Error',
						    text: 'Requisition not yet Submitted'
						});
					}
				});
				actionCell.appendChild(actionButton);
				}
				
            });
			table.style.display = 'table';
			button.textContent = 'Hide Requisitions';
			document.getElementById('requisitionsTable').scrollIntoView({ behavior: 'smooth' });

        })
        .catch(error => console.error('Error fetching requisitions:', error));
		} else {
		    table.style.display = 'none';
		    button.textContent = 'Display Requisitions';
		}
});