/*
document.addEventListener('DOMContentLoaded', function() {
		const userId = sessionStorage.getItem('userId');
	console.log(userId);
    fetch(`/api/purchase-requisitions/status-options?userId=${userId}`)
        .then(response => response.json())
        .then(data => {
			console.log(data);
            const requisitionIdSelect = document.getElementById('requisitionId');

            const requisitionIds = new Set();

            data.forEach(item => {
                requisitionIds.add(item.requisitionId);
            });

            requisitionIds.forEach(id => {
                const option = document.createElement('option');
                option.value = id;
                option.textContent = id;
                requisitionIdSelect.appendChild(option);
            });
        });
});

function getStatus() {
    const requisitionId = document.getElementById('requisitionId').value;

    if (!requisitionId) {
			    Swal.fire({
			        icon: 'error',
			        title: 'Error',
			        text: 'Please select a Requisition ID.'
			    });
        return;
    }

    fetch(`/api/purchase-requisitions/status?requisitionId=${requisitionId}`)
        .then(response => response.json())
        .then(data => {
            const tbody = document.querySelector('#statusTable tbody');
            tbody.innerHTML = '';

            data.forEach(item => {
				const requestedDate = new Date(item.requestedDate);
				const formattedDate = `${requestedDate.getDate().toString().padStart(2, '0')}-${(requestedDate.getMonth() + 1).toString().padStart(2, '0')}-${requestedDate.getFullYear()}`;
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${item.requisitionId}</td>
                    <td>${formattedDate}</td>
                    <td>${item.managerName}</td>
                    <td>${item.vendorName}</td>
					<td>${item.status}</td>
					`;

					tbody.appendChild(row);

            });

            document.getElementById('statusTable').style.display = 'table';
        });
}
*/
document.addEventListener('DOMContentLoaded', function() {
    const userId = sessionStorage.getItem('userId');
    console.log(userId);
    fetch(`/api/purchase-requisitions/status-options?userId=${userId}`)
        .then(response => response.json())
        .then(data => {
            const tbody = document.querySelector('#initialTable tbody');
            tbody.innerHTML = '';

            data.forEach(item => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${item.requisitionId}</td>
                    <td><button  class="status-button" onclick="getStatus('${item.requisitionId}')">Get Status</button></td>
                `;
                tbody.appendChild(row);
            });
        });
});

function getStatus(requisitionId) {
    fetch(`/api/purchase-requisitions/status?requisitionId=${requisitionId}`)
        .then(response => response.json())
        .then(data => {
            const tbody = document.querySelector('#detailedStatusTable tbody');
            tbody.innerHTML = '';

            data.forEach(item => {
                const requestedDate = new Date(item.requestedDate);
                const formattedreqDate = `${requestedDate.getDate().toString().padStart(2, '0')}-${(requestedDate.getMonth() + 1).toString().padStart(2, '0')}-${requestedDate.getFullYear()}`;
				const expectedDate = new Date(item.expectedDate);
				const formattedexpDate = `${expectedDate.getDate().toString().padStart(2, '0')}-${(expectedDate.getMonth() + 1).toString().padStart(2, '0')}-${expectedDate.getFullYear()}`;
				const status = (item.status === 'Approved' || item.status === 'Rejected') ? item.status : 'Pending';
				const row = document.createElement('tr');
                row.innerHTML = `		
                    <td>${item.requisitionId}</td>
					<td>${item.requestedBy}</td>
                    <td>${formattedreqDate}</td>
					<td>${formattedexpDate}</td>
                    <td>${item.managerName}</td>
                    <td>${item.vendorName}</td>
                    <td>${status}</td>
                `;
                tbody.appendChild(row);
            });

            document.getElementById('detailedStatusTable').style.display = 'table';
        });

    fetch(`/api/purchaseOrders/status?requisitionId=${requisitionId}`)
        .then(response => response.json())
        .then(data => {
            const tbody = document.querySelector('#purchaseOrderStatusTable tbody');
            tbody.innerHTML = '';

			if (data.length === 0) {
				document.getElementById('purchaseOrderStatusTable').style.display = 'none';
			    // No purchase orders found, display requisition status with "Pending"
				    fetch(`/api/purchase-requisitions/status?requisitionId=${requisitionId}`)
				        .then(response => response.json())
				        .then(data => {
				            const tbody = document.querySelector('#purchaseOrderStatusTab tbody');
				            tbody.innerHTML = '';

				            data.forEach(item => {
				                const requestedDate = new Date(item.requestedDate);
				                const formattedreqDate = `${requestedDate.getDate().toString().padStart(2, '0')}-${(requestedDate.getMonth() + 1).toString().padStart(2, '0')}-${requestedDate.getFullYear()}`;
				                const expectedDate = new Date(item.expectedDate);
				                const formattedexpDate = `${expectedDate.getDate().toString().padStart(2, '0')}-${(expectedDate.getMonth() + 1).toString().padStart(2, '0')}-${expectedDate.getFullYear()}`;
				                const row = document.createElement('tr');
				                row.innerHTML = `
				                    <td>${item.requisitionId}</td>
				                    <td>${item.requestedBy}</td>
				                    <td>${formattedreqDate}</td>
				                    <td>${formattedexpDate}</td>
				                    <td>${item.managerName}</td>
				                    <td>${item.vendorName}</td>
									<td><textarea class="items" readonly></textarea></td>
									<td class="totalAmount"></td>
				                    <td>Pending</td>
				                `;
				                tbody.appendChild(row);
								fetchRequisitionLines(item.requisitionId, row);

				            });

				            document.getElementById('purchaseOrderStatusTab').style.display = 'table';
				            document.getElementById('purchaseOrderStatusTab').scrollIntoView({ behavior: 'smooth' });
				        });
				} else {
					document.getElementById('purchaseOrderStatusTab').style.display = 'none';
            data.forEach(item => {
                const orderDate = new Date(item.orderDate);
                const deliveryDate = new Date(item.deliveryDate);
                const formattedOrderDate = `${orderDate.getDate().toString().padStart(2, '0')}-${(orderDate.getMonth() + 1).toString().padStart(2, '0')}-${orderDate.getFullYear()}`;
                const formattedDeliveryDate = `${deliveryDate.getDate().toString().padStart(2, '0')}-${(deliveryDate.getMonth() + 1).toString().padStart(2, '0')}-${deliveryDate.getFullYear()}`;
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${item.purchaseOrderId}</td>
                    <td>${item.requisitionId}</td>
                    <td>${item.requestedBy}</td>
                    <td>${item.managerName}</td>
                    <td>${item.vendorName}</td>
                    <td>${formattedOrderDate}</td>
                    <td>${formattedDeliveryDate}</td>
                    <td>${item.items}</td>
                    <td>${item.totalAmount}</td>
                    <td>${item.orderStatus}</td>
                `;
                tbody.appendChild(row);
            });

            document.getElementById('purchaseOrderStatusTable').style.display = 'table';
            document.getElementById('purchaseOrderStatusTable').scrollIntoView({ behavior: 'smooth' });
			}
        });
		
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