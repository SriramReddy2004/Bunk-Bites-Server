const processApprovalRequest = async (status) => {
    try {
        const response = await fetch(
            "/api/admin/process-vendor-request",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ status })
            }
        )
        const decoded = await response.json()
        if(response.status === 201) {
           alert(decoded['message'])
        } else {
           alert(decoded['message'])
        }
    }
    catch(e) {
        console.log(`Error: ${e}`)
    }
}

const approveButton = document.getElementById("approve-button")
approveButton.addEventListener("click", (e) => {
    e.preventDefault()
    processApprovalRequest("approved")
})

const rejectButton = document.getElementById("reject-button")
rejectButton.addEventListener("click", (e) => {
    e.preventDefault()
    processApprovalRequest("rejected")
})