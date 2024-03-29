<script>
	import { Heading, P, A, Img, Button } from 'flowbite-svelte';
</script>

<svelte:head>
    <title>Imbecis :: Sobre</title>
</svelte:head>

<div class="flex justify-center mb-4"></div>

<div class="flex-col justify-center items-center mb-7">
    <div class="w-full flex items-center place-content-center mb-2">
        <Img class="size-20 center" src="/imbecis_logo_300.png" />
    </div>
	<Heading class="mb-4  text-center">Sobre</Heading>
</div>

<P class="mb-3 text-justify">
	Esta webapp <b>está a ser desenvolvida</b> por alguém que está farto de ver imbecis a fazer o que lhes
	apetece na rua, violando constantemente o código da estrada e os deveres cívicos mais básicos sem nenhuma
	consequência.
</P>

<P class="mb-3 text-justify">
	Já que as autoridades não parecem interessadas em fazer cumprir a lei, esta é uma tentativa de
	expor estes comportamentos dignos de um imbecil, na tentativa que estes ao verem a fotografia do
	seu carro na internet, se sintam envergonhados e deixem de ser um peso morto na sociedade.
</P>

<P class="mb-5 text-justify">
	Os utilizadores podem enviar fotografias de carros mal estacionados, ou de carros que tenham feito
	algo que prejudique a mobilidade de outras pessoas. Outros utilizadores irão depois votar e
	decidir se é um imbecil ou não.
</P>

<Heading tag="h3" class="mb-2">Permissões</Heading>

<P class="mb-5 text-justify">
	São precisas permissões para aceder à Câmara do telemóvel, para que possa tirar a fotografia do
	carro mal estacionado. Também é necessária a permissão da Localização no momento de enviar a
	fotografia. Isto é para identificar, de forma vaga, o local onde se encontrava o veículo mal
	estacionado. Para ver, votar em imbecis e para tudo o resto não é necessário nenhuma permissão.
</P>

<Heading tag="h3" class="mb-2">Motivação</Heading>

<P class="mb-5 text-justify">
	Nos últimos anos, e principalmente desde a pandemia COVID-19, temos assistido a uma degradação do
	tecido social do nosso país. Uma falta de respeito e empatia pelos outros que nos rodeiam, uma
	presunção de que o "meu tempo é mais valioso que o de todos os outros", e uma ideologia parola de
	que existe um direito constitucional de um indivíduo poder levar o seu veículo privado até à porta
	de onde quer que vá, custe o que custar e a quem custar, apenas para evitar de andar 1 minuto a
	pé.
</P>

<P class="mb-5 text-justify">
	Esta mentalidade retrógrada do século passado, leva a que as cidades fiquem mais poluídas, mais
	perigosas para todos fora de um carro, mais desorganizadas e menos habitáveis. A mobilidade de
	todos é prejudicada por uns poucos que acham que as regras não se aplicam a eles.
</P>

<iframe
	class="mb-5 w-full aspect-[9/16] rounded-lg"
	src="https://www.youtube.com/embed/f5xJ8_VQG88"
	title="ESTACIONAR EM SEGUNDA FILA"
	frameborder="0"
	allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
	allowfullscreen
></iframe>

<P class="mb-5 text-justify">
	Caminhamos no sentido oposto do progresso, o que se passa em Portugal não acontece nos países mais
	desenvolvidos e mais ricos que o nosso, por alguma razão. Não acontece porque existem
	consequências, e nos meses de verão podemos observar Portugueses Emigrantes a fazer cá o que com
	certeza não fazem lá, porque lá fora há consequências.
</P>

<P class="mb-5 text-justify">
	As nossas cidades cada vez mais parecem cidades de terceiro mundo, de países disfuncionais que não
	conseguem fazer cumprir as próprias leis, onde ninguém cumpre regras de trânsito e se circula a
	monte na via pública, e cede passagem quem tem maior amor ao carro. Uma autêntica selva, uma
	república das bananas.
</P>

<Heading tag="h3" class="mb-2">Como Funciona?</Heading>

<P class="mb-5 text-justify">
	Não é necessário fazer nenhum registo com email, número de telemóvel ou qualquer outro dado
	pessoal. A app não guarda nenhuma informação que possa ser considerada pessoal e passível de
	identificar algum individuo, as denúncias são anónimas.
</P>

<P class="mb-5 text-justify">
	São contudo guardados alguns metadados do dispositivo que está a utilizar para garantir que não
	vota nas próprias denúncias nem vota duas vezes na mesma. É impossível chegar à identidade do
	utilizador através destes metadados.
</P>

<P class="mb-5 text-justify">
	Pode começar a enviar já os imbecis à sua volta clicando <A href="/adicionar">aqui</A>, utilize
	com bom senso e civismo. Os imbecis aprovados pelos outros utilizadores aparecem na <A href="/"
		>pagina inicial</A
	>. Todas as matrículas de imbecis confirmados
	<A href="/matriculas">aparecem aqui</A>. Alternativamente pode <A href="/procurar"
		>pesquisar por uma matrícula</A
	>.
</P>

<Heading tag="h3" class="mb-2">Pedidos de Remoção</Heading>

<P class="mb-5 text-justify">
	Se a sua viatura está registada e deseja removê-la, envie um email para <A
		href="mailto:remover@imbecis.app">remover@imbecis.app</A
	>. A remoção é feita manualmente e será efetuada tão rápido como possível.
</P>
