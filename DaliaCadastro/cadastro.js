async function sendData(userData) {
	try {
		const response = await fetch("http://localhost:3333/user", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(userData),
		});

		const responseData = await response.json();
		console.log("Resposta do servidor:", responseData); 

		if (response.status === 201) {
			alert("Dados salvos com sucesso!");
			window.location.href = "/dália/FrontEnd/DaliaLogin/login.html";
		} else {
			console.error("Erro ao salvar os dados:", responseData);
			alert("Erro ao salvar os dados. Por favor, tente novamente.");
		}
	} catch (error) {
		console.error("Erro na requisição:", error);
		alert("Erro ao salvar os dados. Por favor, tente novamente.");
	}
}

document.addEventListener("DOMContentLoaded", () => {
	const createAccountButton = document.querySelector("button");

	createAccountButton.addEventListener("click", (event) => {
		event.preventDefault();

		const name = document.getElementById("name").value;
		const lastname = document.getElementById("lastname").value;
		const email = document.getElementById("email").value;
		const password = document.getElementById("password").value;
		const passconfirmation = document.getElementById("passconfirmation").value;

		if (name && lastname && email && password && passconfirmation) {
			if (password === passconfirmation) {
				const userData = {
					nome: name,
					sobrenome: lastname,
					email: email,
					senha: password,
				};
				sendData(userData);
				localStorage.setItem("userData", JSON.stringify(userData));
			} else {
				alert("As senhas não coincidem. Por favor, verifique e tente novamente.");
			}
		} else {
			alert("Por favor, preencha todos os campos antes de prosseguir.");
		}
	});
});
