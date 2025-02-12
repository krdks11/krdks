document.addEventListener('DOMContentLoaded', () => {
    // Handle view button clicks
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.dataset.id;
            if (id) {
                window.location.href = `/admin/submissions/${id}`;
            }
        });
    });

    // Handle status updates in the list view
    document.querySelectorAll('.status-update').forEach(select => {
        select.addEventListener('change', async (e) => {
            const id = e.target.dataset.id;
            const newStatus = e.target.value;

            try {
                const response = await fetch(`/admin/submissions/${id}/status`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ status: newStatus })
                });

                const result = await response.json();
                if (result.success) {
                    showNotification('Status updated successfully!', 'success');
                    // Update the status badge
                    const statusBadge = e.target.closest('tr').querySelector('.status-badge');
                    if (statusBadge) {
                        statusBadge.className = `status-badge ${newStatus}`;
                        statusBadge.textContent = newStatus;
                    }
                } else {
                    showNotification('Error updating status', 'error');
                }
            } catch (error) {
                console.error('Error:', error);
                showNotification('Error updating status', 'error');
            }
        });
    });

    // Handle status updates in the detail view
    const statusUpdate = document.getElementById('statusUpdate');
    if (statusUpdate) {
        statusUpdate.addEventListener('change', async () => {
            const id = statusUpdate.dataset.id;
            const newStatus = statusUpdate.value;

            try {
                const response = await fetch(`/admin/submissions/${id}/status`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ status: newStatus })
                });

                const result = await response.json();
                if (result.success) {
                    showNotification('Status updated successfully!', 'success');
                } else {
                    showNotification('Error updating status', 'error');
                }
            } catch (error) {
                console.error('Error:', error);
                showNotification('Error updating status', 'error');
            }
        });
    }
});

function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.add('show');
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 2000);
    }, 100);
} 