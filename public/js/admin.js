document.addEventListener('DOMContentLoaded', () => {
    // Add smooth hover effects to table rows
    const tableRows = document.querySelectorAll('tr');
    tableRows.forEach(row => {
        row.addEventListener('mouseenter', () => {
            row.style.transform = 'translateX(5px)';
            row.style.transition = 'all 0.3s ease';
        });
        row.addEventListener('mouseleave', () => {
            row.style.transform = 'translateX(0)';
        });
    });

    // Handle status updates
    const statusSelects = document.querySelectorAll('.status-update');
    statusSelects.forEach(select => {
        select.addEventListener('change', async (e) => {
            const submissionId = e.target.dataset.id;
            const newStatus = e.target.value;
            
            try {
                const response = await fetch(`/admin/submissions/${submissionId}/status`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ status: newStatus })
                });

                if (response.ok) {
                    // Update the status badge
                    const row = e.target.closest('tr');
                    const statusBadge = row.querySelector('.status-badge');
                    statusBadge.className = `status-badge ${newStatus}`;
                    statusBadge.textContent = newStatus.replace('_', ' ');

                    // Show success notification
                    showNotification('Status updated successfully!', 'success');
                } else {
                    throw new Error('Failed to update status');
                }
            } catch (error) {
                console.error('Error:', error);
                showNotification('Failed to update status', 'error');
            }
        });
    });

    // Handle view button clicks
    const viewButtons = document.querySelectorAll('.view-btn');
    viewButtons.forEach(button => {
        button.addEventListener('click', () => {
            const submissionId = button.dataset.id;
            window.location.href = `/admin/submissions/${submissionId}`;
        });
    });

    // Add notification system
    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
                <span>${message}</span>
            </div>
        `;

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
            notification.style.opacity = '1';
        }, 100);

        // Remove after delay
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            notification.style.opacity = '0';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }

    // Add table sorting
    const tableHeaders = document.querySelectorAll('th');
    tableHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const table = header.closest('table');
            const tbody = table.querySelector('tbody');
            const rows = Array.from(tbody.querySelectorAll('tr'));
            const index = Array.from(header.parentElement.children).indexOf(header);
            const isAscending = header.classList.contains('asc');

            // Sort rows
            rows.sort((a, b) => {
                const aValue = a.children[index].textContent;
                const bValue = b.children[index].textContent;
                return isAscending 
                    ? bValue.localeCompare(aValue) 
                    : aValue.localeCompare(bValue);
            });

            // Update sort direction
            tableHeaders.forEach(h => h.classList.remove('asc', 'desc'));
            header.classList.toggle('asc', !isAscending);
            header.classList.toggle('desc', isAscending);

            // Reorder rows with animation
            rows.forEach((row, i) => {
                row.style.transition = 'none';
                row.style.transform = 'translateY(20px)';
                row.style.opacity = '0';
                setTimeout(() => {
                    tbody.appendChild(row);
                    requestAnimationFrame(() => {
                        row.style.transition = 'all 0.3s ease';
                        row.style.transform = 'translateY(0)';
                        row.style.opacity = '1';
                    });
                }, i * 50);
            });
        });
    });
});