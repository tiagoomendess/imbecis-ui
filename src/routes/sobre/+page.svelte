<script>
	import { Heading, P, A, Img, Li } from 'flowbite-svelte';
</script>

<svelte:head>
	<title>Imbecis :: Sobre</title>
	<meta property="og:image" content="/imbecis_logo_300.png">
	<meta
		property="og:description"
		content="Esta app está a ser desenvolvida que está por alguém que está farto de ver pessoas egoístas
	a fazer o que lhes apetece na rua, violando constantemente o código da estrada e os deveres cívicos
	mais básicos sem nenhuma consequência."
	/>
</svelte:head>

<div class="flex justify-center mb-4"></div>

<div class="flex-col justify-center items-center mb-7">
	<div class="w-full flex items-center place-content-center mb-2">
		<Img class="size-25 center" src="/imbecis_logo_300.png" />
	</div>
	<Heading class="mb-4  text-center">Sobre</Heading>
</div>

<P class="mb-7 text-justify">
	Esta webapp <b>está a ser desenvolvida</b> (beta v0.8) por alguém que está farto de ver pessoas egoístas
	a fazer o que lhes apetece na rua, violando constantemente o código da estrada e os deveres cívicos
	mais básicos sem nenhuma consequência.
</P>

<Heading tag="h3" class="mb-2">Índice</Heading>

<List class="pl-3 mb-7">
	<Li><A href="#permissoes">Permissões e Privacidade</A></Li>
	<Li><A href="#como_participar">Como Participar?</A></Li>
	<Li><A href="#motivacao">Motivação</A></Li>
	<Li><A href="#policia">A Polícia não faz nada</A></Li>
	<Li><A href="#remover">Pedidos de Remoção</A></Li>
	<Li><A href="#ler_mais">Ler Mais</A></Li>
</List>

<Heading id="permissoes" tag="h3" class="mb-2">Permissões e Privacidade</Heading>

<P class="mb-3 text-justify">
	São precisas permissões para aceder à Câmara do telemóvel, para que possa tirar a fotografia do
	carro mal estacionado. Também é necessária a permissão da Localização no momento de enviar a
	fotografia. Isto é para identificar, de forma vaga, o local onde se encontrava o veículo mal
	estacionado. Para ver, votar em imbecis e para tudo o resto não é necessário nenhuma permissão.
</P>

<P class="mb-3 text-justify">
	Para ser o mais transparente possível, são guardados alguns metadados de quem envia denuncias,
	para garantir que não existem votos duplicados, nem que possam votar no mesmo imbecil que
	denunciaram. A boa noticia é que são dados que identificam apenas o dispositivo e nunca o
	individuo. Para além disto, mal um imbecil seja confirmado ou rejeitado, estas informações são
	apagadas permanentemente do servidor, e só existem backups de imbecis confirmados, ou seja, já sem
	metadados. Só mantemos os metadados enquanto eles são estritamente necessários.
</P>

<P class="mb-3 text-justify">
	Faces de pessoas devem ser automaticamente desfocadas. Se por alguma razão existir algum caso em
	que o processo automatico falhou em identificar uma cara, esta vai ser posteriormente desfocada
	manualmente por uma pessoa assim que possível.
</P>

<P class="mb-7 text-justify">
	Para os imbecís egoístas ainda é mais facil, basta não ser um peso morto na sociedade e não violar
	o código da estrada, não estacionando de forma abusiva. É garantido que a sua viatura não aparece
	na app. De qualquer das formas a matricula é desfocada antes de ser pública, e é impossível saber
	qual era a que lá estava porque não são guardadas copias nem o original. Por isso a matrícula que
	aparece em texto à frente pode não ser a que está na imagem. Mas tipo é, mas pode não ser,
	legalmente falando.
</P>

<Heading id="como_participar" tag="h3" class="mb-2">Como Participar?</Heading>

<P class="mb-3 text-justify">
	Para participar é muito fácil, basta encontrar um imbecil na rua estacionado de forma abusiva, e
	submeter uma nova denúncia clicando <A href="/adicionar">aqui</A>. Apenas 1 imbecil por denúncia
	deve estar visível, e text-center mostrar tambem algum do ambiente em redor para perceber se está
	de facto em incumprimento ou não.
</P>
<P class="mb-3 text-justify">
	Os imbecis aprovados pelos outros utilizadores aparecem na <A href="/">pagina inicial</A>. Todas
	as matrículas de imbecis confirmados aparecem
	<A href="/matriculas">aqui</A>. Alternativamente pode pesquisar por uma matrícula <A
		href="/procurar">nesta página</A
	>.
</P>
<P class="mb-7 text-justify">
	Se quiser fazer ainda mais por esta causa, pode ainda fazer download do <A
		href="/imbecis_cartaz.pdf"
		target="_blank">cartaz A4</A
	>
	para imprimir e colocar em zonas habitualmente infestadas por imbecis. Ou fazer o download deste
	<A href="/imbecis_registado.pdf" target="_blank">panfeleto</A> para colocar nos parabrisas dos imbecis
	que encontrar depois de adicionar à App.
</P>

<Heading id="motivacao" tag="h3" class="mb-2">Motivação</Heading>

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
	perigosas para todos fora de um carro, mais desorganizadas, menos eficientes e menos habitáveis. A
	mobilidade de todos é prejudicada por uns poucos que acham que as regras não se aplicam a eles.
</P>

<iframe
	class="mb-5 w-full aspect-[9/16] rounded-lg"
	src="https://www.youtube.com/embed/f5xJ8_VQG88"
	title="ESTACIONAR EM SEGUNDA FILA"
	frameborder="0"
	allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
	allowfullscreen
></iframe>

<P class="mb-3 text-justify">
	Caminhamos no sentido oposto do progresso, o que se passa em Portugal não acontece nos países mais
	desenvolvidos e mais ricos que o nosso, por alguma razão. Não acontece porque existem
	consequências, e nos meses de verão podemos observar Portugueses Emigrantes a fazer cá o que com
	certeza não fazem lá. A impunidade é total, a polícia não faz nada, denuncias são ignoradas,
	chamadas telefónicas a pedir para rebocar veículos são ignoradas.
</P>

<P class="mb-5 text-justify">
	As nossas cidades cada vez mais parecem cidades de terceiro mundo, de países disfuncionais que não
	conseguem fazer cumprir as próprias leis, onde ninguém cumpre regras de trânsito e se circula a
	monte na via pública, e cede passagem quem tem maior amor ao carro. Uma autêntica selva, uma
	república das bananas.
</P>

<Heading id="policia" tag="h3" class="mb-2">A polícia não faz nada</Heading>
<P class="mb-3 text-justify">
	Esta não é uma ferramenta de denúncia à polícia. Para isso existem estas duas aplicações que
	recomendo: "Aqui Não" e "DenúnciaEstacionamento"
</P>
<P class="mb-3 text-justify">
	Esta ferramenta surge precisamente porque a polícia ignora ativamente as denúncias feitas através
	dessas aplicações. Muitas vezes faz pior, em alguns casos a mesma polícia vaza os dados pessoais
	do denunciante ao prevaricador (1), e em outros a polícia exige que o denunciante retire tempo do
	seu dia para ser testemunha da contraordenação (2), o que é um absurdo. Principalmente se tivermos
	em conta que o artigo 170.º do Código da Estrada prevê que, a autoridade que tiver notícia por
	denúncia de contra-ordenarão, levanta auto, não carecendo de presenciar tal contra-ordenarão
	rodoviária.
</P>

<P class="mb-3 text-justify">
	Há situações em que as pessoas são impedidas de entrar nas próprias garagens, ligam para a polícia
	a solicitar a remoção do veículo, e são ignoradas.
</P>

<P class="mb-7 text-justify">
	Por isso não resta muito mais do que apontar o dedo nas esperança que alguns destes imbecis se
	sintam envergonhados e mudem de comportamento. Estamos entregues aos bichos, e no caminho certo
	para nos tornarmos num país de terceiro mundo.
</P>

<Heading id="remover" tag="h3" class="mb-2">Pedidos de Remoção</Heading>

<P class="mb-7 text-justify">
	Se a sua viatura ou cara está registada e deseja removê-la, envie um email para <A
		href="mailto:remover@imbecis.app">remover@imbecis.app</A
	>. A remoção é feita manualmente e será efetuada tão rápido como possível.
</P>

<Heading id="ler_mais" tag="h3" class="mb-2">Ler mais</Heading>

<P class="mb-5 text-justify">
	Lê mais e educa-te sobre mobilidade, planeamento urbanístico e liberta-te da mentalidade
	carro-cêntrica em
	<A href="https://www.reddit.com/r/menoscarros/" target="_blank">r/menoscarros</A>,
	<A href="https://www.strongtowns.org/" target="_blank">strongtowns.org</A>
	e <A href="https://www.youtube.com/@NotJustBikes" target="_blank">NotJustBikes</A>. Um bom ponto
	de partida é este vídeo:
</P>

<iframe
	class="mb-5 w-full aspect-[16/9] rounded-lg"
	src="https://www.youtube.com/embed/uxykI30fS54?si=tJqsgNOV_jwzfYpD"
	title="YouTube video player"
	frameborder="0"
	allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
	referrerpolicy="strict-origin-when-cross-origin"
	allowfullscreen
></iframe>
