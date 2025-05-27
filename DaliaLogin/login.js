async function sendLogin(email, senha) {
    try {
        const response = await fetch("http://localhost:3333/user/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: email,
                senha: senha,
            }),
        });
        const responseData = await response.json();
        console.log(responseData);
        if (responseData.user != null) {
            alert("Login realizado com sucesso");
            localStorage.setItem("idUser", JSON.stringify(responseData.user));
            localStorage.setItem("userEmail", JSON.stringify(email));
            console.log("Email:", email);
            window.location.href = "/dália/FrontEnd/DaliaPerguntas/perguntas.html";
        } else {
            alert("Usuário não encontrado");
            window.location.reload();
        }
    } catch (error) {
        alert("Ocorreu um erro ao tentar realizar login. Tente novamente.");
        console.error("Erro ao realizar login:", error);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const loginButton = document.querySelector(".botaoLogin");

    loginButton.addEventListener("click", (event) => {
        event.preventDefault();

        const emailInput = document.getElementById("exampleInputEmail1");
        const passwordInput = document.getElementById("exampleInputPassword1");

        const email = emailInput.value;
        const password = passwordInput.value;
        sendLogin(email, password);
    });
});
