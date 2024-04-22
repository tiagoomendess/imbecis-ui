<script>
	import { Heading, P, A, Img, List, Li } from 'flowbite-svelte';
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
		<Img class="size-20 center" src="/imbecis_logo_300.png" />
	</div>
	<Heading class="mb-4 text-center">Sobre</Heading>
</div>

<P class="mb-3 text-justify">
	Esta webapp é um protesto ao estado das nossas ruas e à ineficácia das autiridades. <b>Está a ser desenvolvida</b>
	(beta v0.8) por alguém que está farto de ver pessoas egoístas a fazer o que lhes apetece na rua, sem qualquer respeito pelo próximo,
	violando constantemente o código da estrada e os deveres cívicos mais básicos sem nenhuma consequência. Esta é uma consequência, e uma forma de
	tentar educar o condutor Português.
</P>
<P class="mb-7 text-justify">
	Explicando o funcionamento da aplicação de forma muito resumida, utilizadores não autenticados na internet submetem fotografias de veículos
	que acham estar estacionados de forma abusiva, e outros utilizadores também não autenticados votam se acham que é ou não é um imbecil.
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
	qual era a que lá estava porque não são guardadas copias nem o original. Por isso <b>a matrícula que
	aparece à frente em texto à frente pode não ser a que está na imagem. Não é possível saber nem garantir que
	que é a mesma</b>, uma vez que o conteúdo é um campo de texto livre que é preenchido manualmente por utilizadores
	anónimos da internet, que <b>podem inserir o que quiserem</b>, como um comentário numa rede social. E a imagem
	foi irreversivelmente desfocada antes de ser publicada como no Google Maps.
</P>

<Heading id="como_participar" tag="h3" class="mb-2">Como Participar?</Heading>

<P class="mb-3 text-justify">
	Para participar é muito fácil, basta encontrar um imbecil na rua estacionado de forma abusiva, e
	submeter uma nova denúncia clicando <A href="/adicionar">aqui</A>. Apenas 1 imbecil por denúncia
	deve estar visível, e inclua tambem algum do ambiente em redor para perceber se está de facto em
	incumprimento ou não.
</P>
<P class="mb-3 text-justify">
	Os imbecis aprovados pelos outros utilizadores aparecem na <A href="/">pagina inicial</A>. Todas
	as matrículas de imbecis confirmados aparecem
	<A href="/matriculas">na lista de matrículas</A>. Alternativamente pode pesquisar por uma matrícula <A
		href="/procurar">nesta página</A
	>.
</P>
<P class="mb-3 text-justify">
	Pode também votar nos potenciais imbecis que foram enviados por outros utilizadores. Apenas confirme
	aqueles que de facto tem a certeza que está em incumprimento e que consegue ler claramente a matrícula.
	Em todos os outros casos, com mais ou menos dúvida, clicar em "Não Tenho a Certeza".
</P>
<P class="mb-7 text-justify">
	Se quiser fazer ainda mais por esta causa, pode ainda fazer download do <A
		href="/imbecis_cartaz.pdf"
		target="_blank">cartaz A4</A
	>
	para imprimir e colocar em zonas habitualmente infestadas por imbecis. Ou fazer o download deste
	<A href="/imbecis_registado.pdf" target="_blank">panfleto</A> para colocar nos parabrisas dos imbecis
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
	Caminhamos no sentido oposto do progresso, quando as principais economias da europa procuram reduzir a dependência do automóvel,
	nós incentivamos o uso e abuso dele. O que se passa em Portugal não acontece nos países mais
	desenvolvidos e ricos que o nosso, por alguma razão. Existem consequências, e nos meses de verão podemos observar Portugueses
	Emigrantes a fazer cá o que com certeza não fazem lá.
</P>

<P class="mb-5 text-justify">
	As nossas cidades cada vez mais parecem cidades de terceiro mundo, de países disfuncionais que não
	conseguem fazer cumprir as próprias leis, onde ninguém cumpre regras de trânsito e se circula a
	monte na via pública, e cede passagem quem tem maior amor ao carro. Uma autêntica selva, uma
	república das bananas.
</P>

<Heading id="policia" tag="h3" class="mb-2">A polícia não faz nada</Heading>

<P class="mb-3 text-justify">
	Esta não é uma ferramenta de denúncia à polícia, pelo menos por enquanto. Para isso existem estas duas aplicações que
	recomendo: "Aqui Não" e "DenúnciaEstacionamento". No entanto está a ser desenvolvida esta funcionalidade e será lançada no
	futuro.
</P>

<P class="mb-3 text-justify">
	Esta aplicação surge precisamente pela inação e/ou ineficácia da polícia em certos pontos do país.
	Não acontece em 100% do território, mas em muitas localidades as autoridades fazem vista grossa e
	ignoram os abusos, perpetuando a impunidade, a falta de respeito e incentivando a continuação do ato ilícito.
	Em variados casos as denúncias enviadas através dos meios legais são ignoradas, não resultando em nenhuma consequência
	para o infrator.
</P>

<P class="mb-7 text-justify">
	Por isso não resta muito mais do que apontar o dedo nas esperança que alguns destes imbecis se
	sintam envergonhados e mudem de comportamento. Pessoas com mobilidade reduzida, crianças e todos
	no geral merecem o respeito que lhes é devido.
</P>

<Heading id="remover" tag="h3" class="mb-2">Pedidos de Remoção</Heading>

<P class="mb-7 text-justify">
	Se a sua matrícula ou cara está visível e deseja removê-la, envie um email para <A
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
