/* document.addEventListener('DOMContentLoaded', function() {
    populateDropdowns();
});

function populateDropdowns() {
    // Fetch submitted requisitions and products from the backend
    fetch('/api/requisition-lines/submitted')
        .then(response => response.json())
        .then(data => {
            const requisitionDropdown = document.getElementById('requisitionDropdown');
            data.forEach(requisition => {
                const option = document.createElement('option');
                option.value = requisition.requisitionId;
                option.text = requisition.requisitionId;
                requisitionDropdown.add(option);
            });
        });

    fetch('/api/requisition-lines/products')
        .then(response => response.json())
        .then(data => {
            const productDropdown = document.getElementById('productDropdown');
            data.forEach(product => {
                const option = document.createElement('option');
                option.value = product.productId;
                option.text = `${product.productName} - ${product.productCode}`;
                productDropdown.add(option);
            });
        });
}

function updateUnitPrice() {
    const productDropdown = document.getElementById('productDropdown');
    const selectedProductId = productDropdown.value;

    fetch(`/api/requisition-lines/products/${selectedProductId}`)
        .then(response => response.json())
        .then(data => {
            document.getElementById('unitPrice').value = data.unitPrice;
            calculateTotal();
        });
}

function calculateTotal() {
    const unitPrice = parseFloat(document.getElementById('unitPrice').value);
    const quantity = parseInt(document.getElementById('quantity').value);
    const total = unitPrice * quantity;
    document.getElementById('total').value = total.toFixed(2);
}

function addRow() {
    const requisitionDropdown = document.getElementById('requisitionDropdown');
    const productDropdown = document.getElementById('productDropdown');
    const unitPrice = document.getElementById('unitPrice').value;
    const quantity = document.getElementById('quantity').value;
    const total = document.getElementById('total').value;

    const table = document.getElementById('requisitionLinesTable').getElementsByTagName('tbody')[0];
    const newRow = table.insertRow();

    const cell1 = newRow.insertCell(0);
    const cell2 = newRow.insertCell(1);
    const cell3 = newRow.insertCell(2);
    const cell4 = newRow.insertCell(3);
    const cell5 = newRow.insertCell(4);
    const cell6 = newRow.insertCell(5);
    const cell7 = newRow.insertCell(6);

    cell1.innerHTML = table.rows.length;
    cell2.innerHTML = requisitionDropdown.value;
    cell3.innerHTML = productDropdown.options[productDropdown.selectedIndex].text;
    cell4.innerHTML = unitPrice;
	cell5.innerHTML = quantity;
	cell6.innerHTML = total;
    cell7.innerHTML = '<button type="button" onclick="deleteRow(this)">Delete</button>';
}

function deleteRow(button) {
    const row = button.parentNode.parentNode;
    row.parentNode.removeChild(row);
}

function saveRows() {
    const table = document.getElementById('requisitionLinesTable').getElementsByTagName('tbody')[0];
    const rows = table.getElementsByTagName('tr');
    const requisitionLines = [];

    for (let i = 0; i < rows.length; i++) {
        const cells = rows[i].getElementsByTagName('td');
        const requisitionLine = {
            requisitionId: cells[1].innerHTML,
            productId: cells[2].innerHTML.split(' - ')[0],
            productName: cells[2].innerHTML.split(' - ')[1],
            unitPrice: parseFloat(cells[3].innerHTML),
            quantity: parseInt(cells[4].innerHTML),
            total: parseFloat(cells[5].innerHTML)
        };
        requisitionLines.push(requisitionLine);
		console.log(requisitionLines);
    }

    fetch('/api/requisition-lines', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requisitionLines)
    })
    .then(response => response.json())
    .then(data => {
        alert(`Purchase Requisition Lines added successfully - ${data.requisitionId}`);
        resetForm();
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function resetForm() {
    document.getElementById('requisitionLinesForm').reset();
    const table = document.getElementById('requisitionLinesTable').getElementsByTagName('tbody')[0];
    table.innerHTML = '';
}
*/

document.addEventListener('DOMContentLoaded', function() {
	const userId = sessionStorage.getItem('userId');
    populateDropdowns();
	addProductChangeListener();



    // Automatically select the requisitionId from sessionStorage
    const selectedRequisitionId = sessionStorage.getItem('selectedRequisitionId');
    if (selectedRequisitionId) {

		fetch(`/api/requisition-lines/submitted?userId=${userId}`)
		    .then(response => response.json())
		    .then(data => {
				data.forEach(requisition => {
		        if (requisition.requisitionId === selectedRequisitionId && requisition.status === 'Submitted') {
		            const requisitionDropdown = document.getElementById('requisitionDropdown');
		            const option = document.createElement('option');
		            option.value = selectedRequisitionId;
		            option.text = selectedRequisitionId;
		            option.selected = true;
		            requisitionDropdown.add(option);
		        }
				})
				})
				.catch(error => {
					console.error('Error:', error);
				});
				}
});

function populateDropdowns() {
    // Fetch submitted requisitions and products from the backend
	const userId = sessionStorage.getItem('userId');
	const selectedRequisitionId = sessionStorage.getItem('selectedRequisitionId');
	console.log(selectedRequisitionId);
	fetch(`/api/requisition-lines/submitted?userId=${userId}`)
        .then(response => response.json())
        .then(data => {
            const requisitionDropdown = document.getElementById('requisitionDropdown');
            data.forEach(requisition => {
				console.log(requisition.requisitionId);
				console.log(requisition.status);
				// Check if the requisitionId is already added	
				if (requisition.requisitionId !== selectedRequisitionId && requisition.status === 'Submitted') {
                const option = document.createElement('option');
                option.value = requisition.requisitionId;
                option.text = requisition.requisitionId;
                requisitionDropdown.add(option);
				}
            });
        });

    fetch('/api/requisition-lines/products')
        .then(response => response.json())
        .then(data => {
            const productDropdown = document.getElementById('productDropdown');
            data.forEach(product => {
                const option = document.createElement('option');
                option.value = product.productId;
                option.text = `${product.productName} - ${product.productCode}`;
                productDropdown.add(option);
            });
        });
}

function addProductChangeListener() {
    const productDropdown = document.getElementById('productDropdown');
    productDropdown.addEventListener('change', function() {
        document.getElementById('quantity').value = ''; // Clear the quantity field
        document.getElementById('total').value = ''; // Clear the total field
    });
}

function updateUnitPrice() {
    const productDropdown = document.getElementById('productDropdown');
    const selectedProductId = productDropdown.value;

    fetch(`/api/requisition-lines/products/${selectedProductId}`)
        .then(response => response.json())
        .then(data => {
            document.getElementById('unitPrice').value = data.unitPrice;
            calculateTotal();
        });
}

function calculateTotal() {
    const unitPrice = parseFloat(document.getElementById('unitPrice').value);
    const quantity = parseInt(document.getElementById('quantity').value);
    const total = unitPrice * quantity;
    document.getElementById('total').value = total.toFixed(2);
}

function addRow() {
	if (validateForm()){
	const requisitionDropdown = document.getElementById('requisitionDropdown');
    const productDropdown = document.getElementById('productDropdown');
    const unitPrice = document.getElementById('unitPrice').value;
    const quantity = document.getElementById('quantity').value;
    const total = document.getElementById('total').value;
	
	const requisitionId = requisitionDropdown.value;
	const productText = productDropdown.options[productDropdown.selectedIndex].text;

    const table = document.getElementById('requisitionLinesTable').getElementsByTagName('tbody')[0];
	const rows = table.getElementsByTagName('tr');
	for (let i = 0; i < rows.length; i++) {
	        const cells = rows[i].getElementsByTagName('td');
	        if (cells[2].innerHTML === requisitionId && cells[3].innerHTML === productText) {
				Swal.fire({
				    icon: 'error',
				    title: 'Error',
				    text: 'This product has already been added to the selected requisition.'
				});	      
				      return;
	        }
	    }
		
		const lineNumber = table.rows.length + 1 ;
		   const requisitionLineId = `REQ-${requisitionDropdown.value}-${lineNumber.toString().padStart(3, '0')}`;
		   console.log('Initial requisitionLineId:', requisitionLineId);
	

 		checkAndGenerateUniqueLineId(requisitionLineId, function(uniqueLineId) {
        const newRow = table.insertRow();

        const cell1 = newRow.insertCell(0);
        const cell2 = newRow.insertCell(1);
        const cell3 = newRow.insertCell(2);
        const cell4 = newRow.insertCell(3);
        const cell5 = newRow.insertCell(4);
        const cell6 = newRow.insertCell(5);
        const cell7 = newRow.insertCell(6);
        const cell8 = newRow.insertCell(7);

        cell1.innerHTML = lineNumber;
        cell2.innerHTML = uniqueLineId;
        cell3.innerHTML = requisitionDropdown.value;
        cell4.innerHTML = productText;
        cell5.innerHTML = unitPrice;
        cell6.innerHTML = quantity;
        cell7.innerHTML = total;
        cell8.innerHTML = '<button type="button" class="delete-button" onclick="deleteRow(this)">Delete</button>';
		
		document.getElementById('requisitionLinesTable').style.display = 'table';
		document.getElementById('requisitionLinesTable').scrollIntoView({ behavior: 'smooth' });

    });
}
}

function validateForm() {
	const requisitionDropdown = document.getElementById('requisitionDropdown').value;
	    const productDropdown = document.getElementById('productDropdown').value;
	    const unitPrice = document.getElementById('unitPrice').value;
	    const quantity = document.getElementById('quantity').value;
	    const total = document.getElementById('total').value;
		
	
	if (requisitionDropdown === 'Select Requisition Id' || productDropdown === 'Select Product' || !unitPrice || !quantity || !total) {
		        Swal.fire({
		            icon: 'error',
		            title: 'Error',
		            text: 'Please fill in all fields.'
		        });
		        return false;
		    }
		    return true;
		}
	
function checkAndGenerateUniqueLineId(lineId, callback) {
	console.log('Checking lineId:', lineId);
    fetch(`/api/requisition-lines/exists/${lineId}`)
        .then(response => response.json())
        .then(exists => {
			console.log('Exists:', exists);

			if (exists) {
			              const parts = lineId.split('-');
			              console.log('Parts:', parts);

			              const lastPart = parseInt(parts[parts.length - 1], 10);
			              console.log('Last part:', lastPart);

			              if (!isNaN(lastPart)) {
			                  const newLastPart = lastPart + 1;
			                  const newLineId = `${parts.slice(0, -1).join('-')}-${newLastPart.toString().padStart(3, '0')}`;
			                  console.log('New lineId:', newLineId);

			                  checkAndGenerateUniqueLineId(newLineId, callback);
			              } else {
			                  console.error('Error parsing lineId:', lineId);
			              }
			          } else {
			              callback(lineId);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function deleteRow(button) {
    const row = button.parentNode.parentNode;
    row.parentNode.removeChild(row);
	
	const table = document.getElementById('requisitionLinesTable').getElementsByTagName('tbody')[0];
	if (table.rows.length === 0) {
	    document.getElementById('requisitionLinesTable').style.display = 'none';
		}
}

function saveRows() {
	if(validateForm()){
    const table = document.getElementById('requisitionLinesTable').getElementsByTagName('tbody')[0];
    const rows = table.getElementsByTagName('tr');
    const requisitionLines = [];
	const uniqueRequisitionIds = new Set();


    const requisitionDropdown = document.getElementById('requisitionDropdown');
    const selectedRequisitionId = requisitionDropdown.value; // Store the selected requisition ID
	
	if (rows.length === 0) {
	    Swal.fire({
	        icon: 'warning',
	        title: 'Add Products',
	        text: 'Please add at least one product before saving.'
	    });
	    return;
	}

	
	if (!requisitionDropdown.value || !productDropdown.value || !unitPrice || !quantity || !total) {
		Swal.fire({
		    icon: 'error',
		    title: 'Error',
		    text: 'Please fill in all fields.'
		});
			        return;
	    }


    for (let i = 0; i < rows.length; i++) {
        const cells = rows[i].getElementsByTagName('td');
        const requisitionLine = {
			lineId: cells[1].innerHTML,
            requisitionId: cells[2].innerHTML,
			productCode: cells[3].innerHTML.split(' - ')[1],
            productName: cells[3].innerHTML.split(' - ')[0],
            unitPrice: parseFloat(cells[4].innerHTML),
            quantity: parseInt(cells[5].innerHTML),
            total: parseFloat(cells[6].innerHTML)
        };
        requisitionLines.push(requisitionLine);
		uniqueRequisitionIds.add(cells[2].innerHTML);
		console.log(requisitionLine);
    }

    fetch('/api/requisition-lines', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requisitionLines)	
    })
    .then(response => response.json()) // Change to response.text() to handle plain text response  
    .then(data => {
		sessionStorage.removeItem('selectedRequisitionId');
		Swal.fire({
		    icon: 'success',
		    title: 'Success',
		    text: `Purchase Requisition Lines added successfully for requisitions: ${Array.from(uniqueRequisitionIds).join(', ')}`
		});
		        resetForm();

    })
    .catch(error => {
		console.error('Error:', error);
		Swal.fire({
		    icon: 'error',
		    title: 'Error',
		    text: 'An error occurred. Please try again.'
		});
	    });
}
}



function resetForm() {
    document.getElementById('requisitionLinesForm').reset();
    const table = document.getElementById('requisitionLinesTable').getElementsByTagName('tbody')[0];
    table.innerHTML = '';
	document.getElementById('requisitionLinesTable').style.display = 'none'; // Hide table headers
}