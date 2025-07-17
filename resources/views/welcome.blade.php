<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>Laravel</title>

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=figtree:400,600&display=swap" rel="stylesheet" />


    <!-- bootstrap -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css" rel="stylesheet"
        integrity="sha384-rbsA2VBKQhggwzxH7pPCaAqO46MgnOM80zW1RWuH61DGLwZJEdK2Kadq2F9CUG65" crossorigin="anonymous">

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-kenU1KFdBIe4zVF0s0G1M5b4hcpxyD9F7jL+jjXkk+Q2h455rYXK/7HAuoJl+0I4" crossorigin="anonymous">
    </script>



    <!-- estilos -->
    @vite(['resources/css/app.css', 'resources/js/app.js'])
    @vite(['resources/css/welcome.css'])

</head>

<body class="bg-dark text-white">

    <!-- Navigation (Login/Register) -->
    @if (Route::has('login'))
        <div class="position-absolute text-md-start top-0 end-0 p-3 d-flex gap-2">
            @auth
            <a href="{{ url('/dashboard') }}" class="btn btn-cafe">Dashboard</a>
            @else
            <a href="{{ route('login') }}" class="btn-cafe-trasparent">Iniciar sesión</a>
            @if (Route::has('register'))
                <a href="{{ route('register') }}" class="btn-cafe">Registrarse</a>
            @endif
            @endauth
        </div>
    @endif

<div class="container min-vh-100 d-flex flex-column justify-content-center align-items-center pt-5">
    <div class="text-center">
        <h1 class="mt-5 fw-bolder display-3" style="letter-spacing: 2px;">Bienvenido a BeanFlow Coffee</h1>

        <p class="lead mt-4 mb-5" style="max-width: 600px; margin:auto;">
            Descubre en BeanFlow lo mejor para administrar tu cafetería, gestiona pedidos y sorprende a tus clientes fácilmente.
            Da el siguiente paso y lleva tu negocio al siguiente nivel.
        </p>

        <div class="d-flex justify-content-center">
            <img src="{{ asset('img/coffe.png') }}"
                alt="Taza de café humeante sobre mesa de madera"
                class="img-fluid rounded shadow mb-4" style="max-height: 350px;">
        </div>


        <div class="row justify-content-center mt-3">
            <div class="col-md-12 mt-5">
                <a href="" class="btn btn-cafe btn-lg w-100">
                {{-- {{ route('contacto') }} este sera el link para despues llevar al cliente a un formulario de contacto --}}
                    ¡lo quiero!
                </a>
            </div>
            <div class="col-md-12 mt-5 mb-5">
                <a href="#menu" class="btn-cafe-trasparent btn-lg w-100">Necesito saber mas</a>
            </div>
        </div>
    </div>
</div>


    <!-- Botón de WhatsApp IA en la esquina inferior derecha -->
    <a href="#" class="btn-whatsapp"
        title="IA WhatsApp (próximamente)"
        data-bs-toggle="tooltip">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="white" viewBox="0 0 16 16">
            <path
            d="M13.601 2.326A7.952 7.952 0 0 0 8.004 0C3.584 0 .001 3.584.001 8c0 1.409.368 2.782 1.066 3.988L0 16l4.109-1.078A7.963 7.963 0 0 0 8.004 16c4.418 0 8.001-3.584 8.001-8 0-1.591-.468-3.13-1.399-4.326zm-5.597 12.1c-1.235 0-2.452-.326-3.504-.942l-.25-.148-2.438.64.652-2.378-.162-.244C1.37 9.98 1.001 8.999 1.001 8c0-3.866 3.134-7 7.003-7 1.87 0 3.627.728 4.949 2.051A6.96 6.96 0 0 1 15.001 8c0 3.866-3.134 7-7.003 7zm4.01-5.342c-.206-.103-1.221-.603-1.41-.672-.188-.07-.325-.103-.463.103-.137.205-.53.672-.65.81-.12.137-.24.154-.446.052-.206-.103-.868-.32-1.653-1.02-.611-.545-1.022-1.217-1.142-1.423-.12-.205-.013-.316.09-.418.093-.092.206-.24.309-.36.103-.12.137-.205.206-.34.068-.137.034-.257-.017-.36-.052-.103-.463-1.12-.634-1.534-.167-.402-.338-.348-.463-.354l-.395-.007c-.137 0-.36.052-.548.257s-.72.703-.72 1.713c0 1.01.738 1.987.84 2.125.103.137 1.453 2.222 3.522 3.033.492.169.875.27 1.174.346.493.125.942.108 1.297.065.396-.047 1.221-.498 1.393-.98.171-.482.171-.895.12-.98-.051-.086-.188-.137-.394-.24z" />
        </svg>
    </a>




<script>
    document.addEventListener('DOMContentLoaded', function () {
        const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
        tooltipTriggerList.forEach(function (el) {
            new bootstrap.Tooltip(el);
        });
    });
</script>

</body>

</html>
