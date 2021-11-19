module.exports = function errorHandler(msg) {
    Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: msg,
    })
} 

module.exports = function confirmDelete() {
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({
                title: 'Deleted!',
                text: 'Your file has been deleted.',
                icon: 'success',
                timer: 2000,
                showConfirmButton: false
            }, function() {
                window.location.href = "google.com";
            })
        }
    })
}