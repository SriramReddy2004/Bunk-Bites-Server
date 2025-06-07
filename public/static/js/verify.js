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
        if(response.status === 201) {
            open("/user/success")
        } else {
            open("/user/error")
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