/* formulario postulación - trabaja con nosotros */

const formPostulacion = document.getElementById('formPostulacion');

if (formPostulacion) {

    const btn = document.getElementById('btnPostular');

    formPostulacion.addEventListener('submit', async function (e) {

        e.preventDefault();

        btn.disabled = true;
        btn.innerHTML = '<span class="spinner"></span> Enviando...';

        const feedback = document.getElementById('postulacionMsg');

        try {

            const token = await grecaptcha.execute(
                '6LcZ1ActAAAAAEYPg5Betaic_u0_tSd0gJ9uVm9r',
                { action: 'postulacion' }
            );

            const formData = new FormData(formPostulacion);
            formData.append('recaptcha_token', token);

            const response = await fetch('../assets/php/postulacion.php', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            btn.disabled = false;
            btn.innerHTML = '<i class="fa-solid fa-paper-plane me-2"></i> Enviar postulación';

            feedback.style.display = 'block';

            if (data.success) {

                feedback.className = 'form-feedback success';
                feedback.innerHTML = '✅ ' + data.message;
                formPostulacion.reset();

            } else {

                feedback.className = 'form-feedback error';
                feedback.innerHTML = '❌ ' + data.message;

            }

        } catch (error) {

            console.error(error);

            btn.disabled = false;
            btn.innerHTML = '<i class="fa-solid fa-paper-plane me-2"></i> Enviar postulación';

            feedback.style.display = 'block';
            feedback.className = 'form-feedback error';
            feedback.innerHTML = '❌ No se pudo conectar con el servidor.';

        }

    });

}