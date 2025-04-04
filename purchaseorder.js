/*
document.addEventListener('DOMContentLoaded', function() {
    fetchApprovedRequisitions();
    document.getElementById('orderDate').value = new Date().toISOString().split('T')[0];
});

function fetchApprovedRequisitions() {
	const userId = sessionStorage.getItem('userId');
    fetch(`/api/purchaseOrders/requisitions/approved?userId=${userId}`)
        .then(response => response.json())
        .then(data => {
			fetch('/api/purchaseOrders')
			    .then(response => response.json())
			    .then(purchaseOrders => {
            const requisitionSelect = document.getElementById('requisitionId');
			// Clear existing options except the default one
			requisitionSelect.options.length = 1;	
			const purchaseOrderRequisitionIds = purchaseOrders.filter(po => po.orderStatus === 'Created').map(po => po.requisitionId);
		
		data.forEach(requisition => {
			
				if (!purchaseOrderRequisitionIds.includes(requisition.requisitionId)) {
                const option = document.createElement('option');
                option.value = requisition.requisitionId;
                option.text = requisition.requisitionId;
                requisitionSelect.add(option);
				}
				
            });
        });
		});
}		

function fetchRequisitionDetails() {
    const requisitionId = document.getElementById('requisitionId').value;
    fetch(`/api/purchaseOrders/requisitions/${requisitionId}`)
        .then(response => response.json())
        .then(data => {
            document.getElementById('vendorName').value = data.vendorName;
			console.log(data);
			console.log(data.vendorName);
			fetchRequisitionLines(requisitionId);
});
}


function fetchRequisitionLines(requisitionId) {
    fetch(`/api/purchaseOrders/requisitionLines/${requisitionId}`)
        .then(response => response.json())
        .then(data => {
            let items = '';
            let totalAmount = 0;
            data.forEach(line => {
                items += `Product: ${line.productName}, Quantity: ${line.quantity}, Unit Price: ${line.unitPrice}, Total: ${line.total}\n`;
                totalAmount += line.total;
            });
            document.getElementById('items').value = items;
            document.getElementById('totalAmount').value = totalAmount.toFixed(2);
        });
}

function savePurchaseOrder() {
	if (validateForm()) {
    const purchaseOrder = getPurchaseOrderData();
    purchaseOrder.orderStatus = 'Draft';
	console.log(purchaseOrder);
    sendPurchaseOrder(purchaseOrder, 'saved');
}
}

function submitPurchaseOrder() {
	if (validateForm()) {
    const purchaseOrder = getPurchaseOrderData();
    purchaseOrder.orderStatus = 'Created';
    sendPurchaseOrder(purchaseOrder, 'submitted');

	// Store the order date before resetting the form
	const orderDate = document.getElementById('orderDate').value;

	// Reset the entire form
	document.getElementById('purchaseOrderForm').reset();

	// Restore the order date after reset
	document.getElementById('orderDate').value = orderDate;
	
	// Set the status field back to 'Draft' after reset
	document.getElementById('status').value = 'Draft';	
	

}
}

function validateForm() {
    const requisitionId = document.getElementById('requisitionId').value;
    const deliveryDate = document.getElementById('deliveryDate').value;
	const orderDate = document.getElementById('orderDate').value;
	const items = document.getElementById('items').value;

	
    if (requisitionId === 'Select Requisition ID' || !deliveryDate || !items) {
		    Swal.fire({
		        icon: 'error',
		        title: 'Error',
		        text: 'Please fill in all required fields.'
		    });
		    return false;
		}	
	
	if (new Date(deliveryDate) <= new Date(orderDate)) {
		    Swal.fire({
		        icon: 'error',
		        title: 'Error',
		        text: 'Delivery date must be greater than the order date.'
		    });
		    return false;
		}

	    return true;
}

function getPurchaseOrderData() {
	const purchaseOrderId = document.getElementById('purchaseOrderId').value;
	console.log(purchaseOrderId);

    return {
		purchaseOrderId: purchaseOrderId ? purchaseOrderId : null,
        requisitionId: document.getElementById('requisitionId').value,
        vendorName: document.getElementById('vendorName').value,
        orderDate: document.getElementById('orderDate').value,
        deliveryDate: document.getElementById('deliveryDate').value,
        items: document.getElementById('items').value,
        totalAmount: document.getElementById('totalAmount').value,
        orderStatus: document.getElementById('status').value
    };
}

function sendPurchaseOrder(purchaseOrder , action) {
    fetch('/api/purchaseOrders', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(purchaseOrder)
    })
    .then(response => response.json())
    .then(data => {
		purchaseOrder.purchaseOrderId = data.purchaseOrderId; // Update the purchase order ID
		        Swal.fire({
		            icon: 'success',
		            title: 'Success',
		            html: `Purchase Order ${action} successfully!<br> ${data.purchaseOrderId}`,
		            showConfirmButton: true // Require user interaction to close the popup
		        }).then(() => {
		            if (action === 'saved') {
		                document.getElementById('purchaseOrderId').value = data.purchaseOrderId;
		            }
					else if (action === 'submitted') {
					               location.reload(); // Refresh the page only if the form is submitted
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

	*/

	document.addEventListener('DOMContentLoaded', function() {
	    fetchApprovedRequisitions();
	    document.getElementById('orderDate').value = new Date().toISOString().split('T')[0];
	});

	// Global object to store purchaseOrderIds by requisitionId
	const purchaseOrderMap = {};

	function fetchApprovedRequisitions() {
	    const userId = sessionStorage.getItem('userId');
	    fetch(`/api/purchaseOrders/requisitions/approved?userId=${userId}`)
	        .then(response => response.json())
	        .then(data => {
				


				data.sort((a, b) => {
				    const dateA = new Date(a.requisitionId.split('-').pop().replace(/(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1-$2-$3T$4:$5:$6'));
				    const dateB = new Date(b.requisitionId.split('-').pop().replace(/(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1-$2-$3T$4:$5:$6'));
				    console.log(dateA); // Check the parsed date

					    console.log(dateB); // Check the parsed date
					    return dateB - dateA; // Sort in descending order
					});


				console.log(data);
	            fetch('/api/purchaseOrders')
	                .then(response => response.json())
	                .then(purchaseOrders => {
						console.log(purchaseOrders);
	                    const tableBody = document.getElementById('purchaseOrderTable').querySelector('tbody');
	                    tableBody.innerHTML = ''; // Clear existing rows

	                    const purchaseOrderRequisitionIds = purchaseOrders.filter(po => po.orderStatus === 'Created').map(po => po.requisitionId);

	                    data.forEach(requisition => {
							console.log(requisition);
	                        if (!purchaseOrderRequisitionIds.includes(requisition.requisitionId)) {
	                            const row = document.createElement('tr');
	                            row.setAttribute('data-requisition-id', requisition.requisitionId); // Add data attribute
	                            const orderDate = new Date().toISOString().split('T')[0];
	                            const formattedOrderDate = formatDate(orderDate);
	                            row.innerHTML = `
	                                <td>${requisition.requisitionId}</td>
	                                <td>${requisition.requestedBy}</td>
	                                <td>${requisition.managerName}</td>
	                                <td>${requisition.vendorName}</td>
	                                <td>${formattedOrderDate}</td>
	                                <td><input type="date" class="deliveryDate" data-requisition-id="${requisition.requisitionId}"></td>
	                                <td><textarea class="items" readonly></textarea></td>
	                                <td class="totalAmount"></td>
	                                <td>
	                                    <button type="button" class="save-btn" onclick="savePurchaseOrder('${requisition.requisitionId}')">Save</button>
	                                </td>
	                                <td>
	                                    <button type="button" class="submit-btn" onclick="submitPurchaseOrder('${requisition.requisitionId}')">Submit</button>
	                                </td>
	                            `;
	                            tableBody.appendChild(row);
	                            fetchRequisitionLines(requisition.requisitionId, row);
	                        }
	                    });
	                });
	        });
	}

	function formatDate(dateString) {
	    const date = new Date(dateString);
	    const day = String(date.getDate()).padStart(2, '0');
	    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
	    const year = date.getFullYear();
	    return `${day}-${month}-${year}`;
	}

	function fetchRequisitionLines(requisitionId, row) {
	    fetch(`/api/purchaseOrders/requisitionLines/${requisitionId}`)
	        .then(response => response.json())
	        .then(data => {
	            let items = '';
	            let totalAmount = 0;
	            data.forEach(line => {
	                items += `Product: ${line.productName}, Quantity: ${line.quantity}, Unit Price: ${line.unitPrice}, Total: ${line.total}\n`;
	                totalAmount += line.total;
	            });
	            row.querySelector('.items').value = items;
	            row.querySelector('.totalAmount').textContent = totalAmount.toFixed(2);    
	        });
	}

	function savePurchaseOrder(requisitionId) {
	    const row = document.querySelector(`tr[data-requisition-id="${requisitionId}"]`);
	    if (validateRow(row)) {
	        const purchaseOrder = getPurchaseOrderData(row);
	        purchaseOrder.orderStatus = 'Pending';
	        sendPurchaseOrder(purchaseOrder, 'saved', row);
	    }
	}

	function submitPurchaseOrder(requisitionId) {
	    const row = document.querySelector(`tr[data-requisition-id="${requisitionId}"]`);
	    if (validateRow(row)) {
	        const purchaseOrder = getPurchaseOrderData(row);
	        purchaseOrder.orderStatus = 'Created';
	        // Check if purchaseOrderId already exists for this requisitionId
	        if (purchaseOrderMap[requisitionId]) {
	            purchaseOrder.purchaseOrderId = purchaseOrderMap[requisitionId];
	        }
	        sendPurchaseOrder(purchaseOrder, 'submitted', row);
	    }
	}

	function validateRow(row) {
	    const deliveryDate = row.querySelector('.deliveryDate').value;
	    const orderDate = row.querySelector('td:nth-child(5)').textContent;
	    const items = row.querySelector('.items').value;

	    if (!deliveryDate || !items) {
	        Swal.fire({
	            icon: 'error',
	            title: 'Error',
	            text: 'Please fill in all required fields.'
	        });
	        return false;
	    }

	    // Convert dates to comparable formats
	    const [orderDay, orderMonth, orderYear] = orderDate.split('-');
	    const orderDateObj = new Date(`${orderYear}-${orderMonth}-${orderDay}`);
	    const deliveryDateObj = new Date(deliveryDate);

	    if (deliveryDateObj <= orderDateObj) {
	        Swal.fire({
	            icon: 'error',
	            title: 'Error',
	            text: 'Delivery date must be greater than the order date.'
	        });
	        return false;
	    }

	    return true;
	}

	function getPurchaseOrderData(row) {
	    return {
	        purchaseOrderId: row.querySelector('.purchaseOrderId') ? row.querySelector('.purchaseOrderId').value : null,
	        requisitionId: row.querySelector('td:nth-child(1)').textContent,
	        requestedBy: row.querySelector('td:nth-child(2)').textContent,
	        managerName: row.querySelector('td:nth-child(3)').textContent,
	        vendorName: row.querySelector('td:nth-child(4)').textContent,
	        orderDate: row.querySelector('td:nth-child(5)').textContent,
	        deliveryDate: row.querySelector('.deliveryDate').value,
	        items: row.querySelector('.items').value,
	        totalAmount: row.querySelector('.totalAmount').textContent,
	        orderStatus: 'Draft' // Default status
	    };
	}

	function sendPurchaseOrder(purchaseOrder, action, row) {
	    // Convert the orderDate to the required format before sending
	    const [day, month, year] = purchaseOrder.orderDate.split('-');
	    const orderDate = new Date(`${year}-${month}-${day}T00:00:00`);
	    if (isNaN(orderDate.getTime())) {
	        console.error('Invalid order date:', purchaseOrder.orderDate);
	        Swal.fire({
	            icon: 'error',
	            title: 'Error',
	            text: 'Invalid order date. Please check the date format.',
	            showConfirmButton: true // Require user interaction to close the popup
	        });
	        return;
	    }
	    const formattedOrderDate = orderDate.toISOString().split('.')[0]; // Format as '2025-03-18T05:30:00'
	    purchaseOrder.orderDate = formattedOrderDate;

	    fetch('/api/purchaseOrders', {
	        method:  'POST', // Use PUT if purchaseOrderId exists, otherwise POST
	        headers: {
	            'Content-Type': 'application/json'
	        },
	        body: JSON.stringify(purchaseOrder)
	    })
	    .then(response => {
	        if (!response.ok) {
	            throw new Error(`HTTP error! status: ${response.status}`);
	        }
	        return response.json();
	    })
	    .then(data => {
	        purchaseOrder.purchaseOrderId = data.purchaseOrderId; // Update the purchase order ID
	        purchaseOrderMap[purchaseOrder.requisitionId] = data.purchaseOrderId; // Store the purchaseOrderId in the map
	        row.setAttribute('data-purchase-order-id', data.purchaseOrderId); // Store the purchaseOrderId in the row
	        Swal.fire({
	            icon: 'success',
	            title: 'Success',
	            html: `Purchase Order ${action} successfully!<br> ${data.purchaseOrderId}`,
	            showConfirmButton: true // Require user interaction to close the popup
	        }).then(() => {
	            const element = row.querySelector('.purchaseOrderId');
	            if (element) {
	                element.value = data.purchaseOrderId;
	            } else {
	                // If the element is not found, create it and append it to the row
	                const hiddenInput = document.createElement('input');
	                hiddenInput.type = 'hidden';
	                hiddenInput.className = 'purchaseOrderId';
	                hiddenInput.value = data.purchaseOrderId;
	                row.appendChild(hiddenInput);
	            }
	            if (action === 'submitted') {
	                addCreatedPurchaseOrderRow(purchaseOrder);
	                removePurchaseOrderRow(purchaseOrder.requisitionId);
	                displayCreatedPurchaseOrdersTable();
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
	function addCreatedPurchaseOrderRow(purchaseOrder) {
	    const tableBody = document.getElementById('createdPurchaseOrderTable').querySelector('tbody');
	    const row = document.createElement('tr');
	    row.innerHTML = `
	        <td>${purchaseOrder.purchaseOrderId}</td>
	        <td>${purchaseOrder.requisitionId}</td>
	        <td>${purchaseOrder.requestedBy}</td>
	        <td>${purchaseOrder.managerName}</td>
	        <td>${purchaseOrder.vendorName}</td>
	        <td>${formatDate(purchaseOrder.orderDate.split(' ')[0])}</td>
	        <td>${formatDate(purchaseOrder.deliveryDate)}</td>
	        <td>${purchaseOrder.items}</td>
	        <td>${purchaseOrder.totalAmount}</td>
	        <td>${purchaseOrder.orderStatus}</td>
	    `;
	    tableBody.appendChild(row);
	    console.log('Added row to Created Purchase Orders table:', row); // Log the added row
	}

	function removePurchaseOrderRow(requisitionId) {
	    const tableBody = document.getElementById('purchaseOrderTable').querySelector('tbody');
	    const row = tableBody.querySelector(`tr[data-requisition-id="${requisitionId}"]`);
	    if (row) {
	        tableBody.removeChild(row);
	        console.log('Removed row from Purchase Orders table:', row); // Log the removed row
	    }
	}

	function displayCreatedPurchaseOrdersTable() {
	    const createdTableContainer = document.getElementById('createdPurchaseOrderContainer');
	    createdTableContainer.style.display = 'block';
	}

	function formatDate(dateString) {
	    const date = new Date(dateString);
	    const day = String(date.getDate()).padStart(2, '0');
	    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
	    const year = date.getFullYear();
	    return `${day}-${month}-${year}`;
	}