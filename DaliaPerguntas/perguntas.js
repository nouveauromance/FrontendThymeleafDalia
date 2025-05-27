document.addEventListener("DOMContentLoaded", async () => {
	const formularios = document.querySelectorAll(".formulario");
	let currentForm = 0;

	const responses = {
		usuario_id: null,
		idade: null,
		menstruacao_regular: null,
		usa_contraceptivo: null,
		tipo_contraceptivo: null,
		ultimo_dia_menstruacao: null,
		duracao_ciclo: null,
	};
	const idUser = localStorage.getItem("idUser");
	responses.usuario_id = idUser;
	const nextForm = () => {
		formularios[currentForm].classList.add("hidden");
		currentForm++;
		if (currentForm < formularios.length) {
			formularios[currentForm].classList.remove("hidden");
		} else {
			enviarRespostas();
		}
	};

	const previousForm = () => {
		formularios[currentForm].classList.add("hidden");
		currentForm--;
		formularios[currentForm].classList.remove("hidden");
	};

	const enviarRespostas = async () => {
		console.log("Respostas antes de enviar:", responses);
		try {
			const response = await fetch("http://localhost:3333/questions", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(responses),
			});

			if (response.ok) {
				console.log("Respostas enviadas com sucesso!");
				window.location.href = "/dália/FrontEnd/home/index.html";
			} else {
				console.error("Erro ao enviar as respostas");
			}
		} catch (error) {
			console.error("Erro na requisição:", error);
		}
	};

	formularios.forEach((formulario, index) => {
		if (index !== 0) {
			formulario.classList.add("hidden");
		}
	});

	document.querySelectorAll(".r1 input[type='radio']").forEach((input) => {
		input.addEventListener("click", () => {
			responses.idade = input.nextElementSibling.textContent;
			console.log("idade:", responses.idade);
			nextForm();
		});
	});

	document.querySelectorAll(".r2 input[type='radio']").forEach((input) => {
		input.addEventListener("click", () => {
			responses.menstruacao_regular = input.value;
			console.log("menstruacao_regular:", responses.menstruacao_regular);
			nextForm();
		});
	});

	document.querySelectorAll("#section3 input[type='radio']").forEach((input) => {
		input.addEventListener("click", () => {
			responses.usa_contraceptivo = input.value;
			console.log(responses.usa_contraceptivo);
			nextForm();
		});
	});

	document.querySelectorAll(".r4 input[type='radio']").forEach((input) => {
		input.addEventListener("click", () => {
			responses.tipo_contraceptivo = input.value;
			console.log(responses.tipo_contraceptivo);
			nextForm();
		});
	});

	document.querySelector(".btn__fim").addEventListener("click", (e) => {
		e.preventDefault();
		const duracaoCiclo = document.getElementById("periodo").value;

		if (duracaoCiclo < 20) {
			alert("A duração do ciclo não pode ser menor que 20 dias.");
			return;
		}

		responses.ultimo_dia_menstruacao =
			document.getElementById("ultima-menstruacao").value;
		responses.duracao_ciclo = duracaoCiclo;
		enviarRespostas();
	});

	document.querySelectorAll(".volta").forEach((button) => {
		button.addEventListener("click", previousForm);
	});

	function showSection(sectionId) {
		document.querySelectorAll(".section").forEach((section) => {
			section.classList.remove("active");
			section.style.display = "none";
		});

		const newSection = document.getElementById(sectionId);
		if (newSection) {
			newSection.style.display = "block";
			setTimeout(() => {
				newSection.classList.add("active");
			}, 10);
		}
	}

	window.addEventListener("load", () => {
		showSection("section1");
	});

	document.querySelectorAll(".painel__idade").forEach((card) => {
		card.addEventListener("click", () => {
			showSection("section2");
		});
	});

	document.querySelectorAll(".B0").forEach((button) => {
		button.addEventListener("click", () => showSection("section1"));
	});

	document.querySelectorAll(".B1").forEach((button) => {
		button.addEventListener("click", () => showSection("section2"));
	});

	document.querySelectorAll(".B2").forEach((button) => {
		button.addEventListener("click", () => showSection("section3"));
	});

	document.querySelectorAll(".B3").forEach((button) => {
		button.addEventListener("click", () => showSection("section4"));
	});

	document.querySelectorAll(".B4").forEach((button) => {
		button.addEventListener("click", () => showSection("section5"));
	});

	document.querySelectorAll(".B5").forEach((button) => {
		button.addEventListener("click", () => showSection("section6"));
	});

	flatpickr("#ultima-menstruacao", {
		dateFormat: "Y-m-d",
	});
});
