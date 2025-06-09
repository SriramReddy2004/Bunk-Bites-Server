const verifyAccount = async (token) => {
    try {
        const response = await fetch(
            "/api/user/verify",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            }
        )
        const decoded = await response.json()
        if(response.status >= 200 && response.status < 300) {
            // console.log(decoded)
            alert(decoded['message'])
        } else {
            // open("/user/error")
            alert(decoded['message'])
        }
    }
    catch(e) {
        console.log(e)
        alert("failed")
    }
}

const verifyAccountButton = document.getElementById("verify-button")
verifyAccountButton.addEventListener("click", (e) => {
    verifyAccount(token)
})