<script>
	import { Heading, P, A, Img, List, Li, Button } from 'flowbite-svelte';
	import Content from '$lib/components/Content.svelte';
</script>

<svelte:head>
	<title>Imbecis :: Sobre</title>
	<meta property="og:image" content="/imbecis_logo_300.png" />
	<meta
		property="og:description"
		content="Esta app está a ser desenvolvida que está por alguém que está farto de ver pessoas egoístas
	a fazer o que lhes apetece na rua, violando constantemente o código da estrada e os deveres cívicos
	mais básicos sem nenhuma consequência."
	/>
</svelte:head>

<Content>
	<div class="flex justify-center mb-4"></div>

	<div class="flex-col justify-center items-center mb-7">
		<div class="w-full flex items-center place-content-center mb-2">
			<Img class="size-20 center" src="/imbecis_logo_300.png" />
		</div>
		<Heading class="mb-4 text-center">Sobre</Heading>
	</div>

	<P class="mb-3 text-justify">
		Esta webapp é um protesto ao estado das nossas ruas e à ineficácia das autoridades. <b
			>Está a ser desenvolvida</b
		>
		(v1.0) por alguém que está farto de ver pessoas egoístas a fazer o que lhes apetece na rua,
		sem qualquer respeito pelo próximo, violando constantemente o código da estrada e os deveres cívicos
		mais básicos sem nenhuma consequência.
	</P>
	<P class="mb-3 text-justify">
		Explicando o funcionamento da aplicação de forma muito resumida, utilizadores não autenticados
		na internet submetem fotografias de veículos que acham estar estacionados de forma abusiva. Depois
		outros utilizadores, também não autenticados, votam se acham se é verdade ou não. É utilizado o 
		adjetivo "Imbecil" como forma de "gamificação" da plataforma e incentivar a participação na votação.
	</P>
	<P class="mb-7 text-justify">
		Quando uma denúncia é confirmada por vários utilizadores, <b>é enviado um email às autoridades</b> responsáveis
		pela fiscalização rodoviária da área onde o veículo foi denunciado, e adicionado ao feed e histórico para
		a posteridade.
	</P>

	<Heading tag="h3" class="mb-2">Índice</Heading>

	<List class="pl-3 mb-7">
		<Li><A href="#permissoes">Permissões e Privacidade</A></Li>
		<Li><A href="#como_participar">Como Participar?</A></Li>
		<Li><A href="#ajudar">Ajudar</A></Li>
		<Li><A href="#motivacao">Motivação</A></Li>
		<Li><A href="#fiscalizacao">O problema da fiscalização</A></Li>
		<Li><A href="#remover">Pedidos de Remoção</A></Li>
		<Li><A href="#ler_mais">Ler Mais</A></Li>
	</List>

	<Heading id="permissoes" tag="h3" class="mb-2">Permissões e Privacidade</Heading>

	<P class="mb-3 text-justify">
		São precisas permissões para aceder à Câmara do telemóvel, para que possa tirar a fotografia do
		carro mal estacionado. Também é necessária a permissão da Localização no momento de tirar a
		fotografia. Isto é para identificar o local onde se encontrava o veículo mal estacionado. 
		Para ver, votar e tudo o resto não é necessário nenhuma permissão.
	</P>

	<P class="mb-3 text-justify">
		Para ser o mais transparente possível, são guardados alguns metadados de quem envia denúncias,
		para garantir que não existem votos duplicados, nem que possam votar na mesma denúncia que
		enviaram. A boa notícia é que são dados que identificam apenas o dispositivo e nunca o
		indivíduo. Para além disto, mal uma denúncia seja confirmada ou rejeitada, estas informações são
		apagadas permanentemente do servidor, e só existem backups de denúncias confirmadas, ou seja, já
		sem metadados. Só mantemos os metadados enquanto eles são estritamente necessários.
	</P>

	<P class="mb-7 text-justify">
		Antes de submeter uma denúncia, o utilizador pode também inserir os dados pessoais para serem enviados
		junto com a denúncia para as autoridades. É aconselhável que o faça, para diminuir as probabilidades de a 
		denúncia ser descartada pela polícia. À semelhança dos metadados, estes dados mais sensíveis são apagados
		permanentemente mal o email é enviado. Neste caso, o utilizador vai ver o email enviado porque vai em Cc,
		por isso não deve estranhar se horas depois aparecer um email da caixa de entrada.
	</P>

	<Heading id="como_participar" tag="h3" class="mb-2">Como Participar?</Heading>

	<P class="mb-3 text-justify">
		Para participar é muito fácil, basta encontrar um carro estacionado de forma ilegal, e
		submeter uma nova denúncia clicando <A href="/adicionar">aqui</A>. Apenas 1 carro por denúncia
		deve estar visível, e inclua também algum do ambiente em redor para perceber se está de facto em
		incumprimento ou não.
	</P>
	<P class="mb-3 text-justify">
		As denúncias aprovadas pelos outros utilizadores aparecem na <A href="/">pagina inicial</A>. Todas
		as matrículas de denúncias confirmadas aparecem
		<A href="/matriculas">na lista de matrículas</A>. Alternativamente pode pesquisar por uma
		matrícula <A href="/procurar">nesta página</A>.
	</P>
	<P class="mb-3 text-justify">
		Pode também votar nas denúncias que foram enviadas por outros utilizadores. Apenas
		confirme aqueles que de facto tem a certeza que está em incumprimento e que consegue ler
		claramente a matrícula. Em todos os outros casos, com mais ou menos dúvida, <b>clicar sempre em "Não Tenho
		a Certeza"</b>.
	</P>

	<Heading id="ajudar" tag="h3" class="mb-2">Ajudar</Heading>

	<P class="mb-3 text-justify">
		Se quiser fazer ainda mais por esta causa para além de enviar e votar em denúncias, pode
		começar por partilhar esta aplicação com os seus amigos e familiares, para que chegue e
		sensibilize o maior número de pessoas possível. Pode ainda fazer download de um cartaz para
		imprimir e colocar em zonas que habitualmente sofrem com o estacionamento abusivo, para chegar
		também a essas pessoas.
	</P>
	<div class="flex justify-center mb-3">
		<Button href="/imbecis_cartaz.pdf" target="_blank">Descarregar Cartaz</Button>
	</div>
	<P class="mb-3 text-justify">
		Pode também fazer download de um panfleto para colocar nos parabrisas de carros estacionados de
		forma abusiva depois de os adicionar à aplicação.
	</P>

	<div class="flex justify-center mb-7">
		<Button href="/imbecis_registado.pdf" target="_blank">Descarregar Panfleto</Button>
	</div>

	<Heading id="motivacao" tag="h3" class="mb-2">Motivação</Heading>

	<P class="mb-5 text-justify">
		Nos últimos anos, e principalmente desde a pandemia COVID-19, temos assistido a uma degradação
		do tecido social do nosso país. Uma falta de respeito e empatia pelos outros que nos rodeiam,
		uma presunção de que o "meu tempo é mais valioso que o de todos os outros", e uma ideologia
		parola de que existe um direito constitucional de um indivíduo poder levar o seu veículo privado
		até à porta de onde quer que vá, custe o que custar e a quem custar, apenas para evitar de andar
		1 minuto a pé.
	</P>

	<P class="mb-5 text-justify">
		Esta mentalidade retrógrada do século passado, leva a que as cidades fiquem mais poluídas, mais
		perigosas para todos fora de um carro, mais desorganizadas, menos eficientes e menos habitáveis.
		A mobilidade de todos é prejudicada por uns poucos que acham que as regras não se aplicam a
		eles.
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
		Caminhamos no sentido oposto do progresso, quando as principais economias da europa procuram
		reduzir a dependência do automóvel, nós incentivamos o uso e abuso dele. O que se passa em
		Portugal não acontece nos países mais desenvolvidos e ricos que o nosso, por alguma razão.
		Existem consequências, e nos meses de verão podemos observar Portugueses Emigrantes a fazer cá o
		que com certeza não fazem lá.
	</P>

	<P class="mb-5 text-justify">
		As nossas cidades cada vez mais parecem cidades de terceiro mundo, de países disfuncionais que
		não conseguem fazer cumprir as próprias leis, onde ninguém cumpre regras de trânsito e se
		circula a monte na via pública, e cede passagem quem tem maior amor ao carro. Uma autêntica
		selva, uma república das bananas.
	</P>

	<Heading id="fiscalizacao" tag="h3" class="mb-2">O problema da fiscalização</Heading>

	<P class="mb-3 text-justify">
		Com a certeza absoluta de que não estou a generalizar demasiado, a fiscalização rodoviária em Portugal é cronicamente ineficaz.
		Basta sair à rua em qualquer cidade, pequena, média ou grande para constatar este facto. Esta é uma tentativa 
		de melhorar a situação, de optimizar e facilitar a fiscalização e penalização dos infractores, e de sensibilizar
		a população civil em geral, mas não só.
	</P>

	<P class="mb-3 text-justify">
		Existem inúmeros relatos de situações de denúncias que são ativamente ignoradas pelas autoridades, ainda que sejam
		denunciadas por cidadãos devidamente identificados e com provas fotográficas. A sensação que fica é de que a autoridade
		que deveria fiscalizar e punir os infractores, geralmente dá o benifício da dúvida e defende o infractor, perpetuando
		e agravando o problema.
	</P>

	<P class="mb-3 text-justify">
		Depois o resultado é o que podemos ver diariamente: carros estacionados em vias e paragens de autocarro, em cima de
		passeios, passadeiras a bloquear carrinhos de bebé e cadeiras de rodas, a obstruir campos de visão em passadeiras,
		aumentando o risco de atropelamentos. Em cima de ciclovias, obrigando os utilizadores a correr ainda mais riscos 
		ao necessitarem de entrar na faixa de rodagem constantemente para se desviarem de todos os obstáculos.
	</P>

	<P class="mb-3 text-justify">
		Se uma pessoa estaciona legalmente a 100 metros da farmácia, perde 5 minutos a andar a pé, mas uma outra estaciona
		ilegalmente à porta, causando embaraço a inúmeras pessoas, e para além de não lhe acontecer nada,
		ainda é atendido primeiro e despacha-se mais rápido, que estrutura de incentivo é esta? Estamos a premiar comportamentos
		destes e a penalizar quem cumpre as regras. Isto é inaceitável.
	</P>

	<P class="mb-7 text-justify">
		Com esta aplicação não há desculpa, nunca foi tão fácil e rápido denunciar um carro mal estacionado com todas as provas 
		necessárias. As autoridades também não têm desculpa para não agir e fazerem o seu trabalho de forma bem mais facilitada.
		As denúncias enviadas enunciam todos os detalhes necessários, incluindo identificação de testemunhas, localização exata,
		fotografia e checksum SHA256 que garante a integridade da fotografia. Para além, disso agora passa a ser transparente quais
		são as cidades e autoridades que de facto decidem agir sobre um problema estrutural, e quais as que decidem fazer vista
		grossa. As denúncias continuarão a ser publicadas no feed da aplicação e no sub reddit 
		<A target="_blank" href="https://reddit.com/r/imbecis">r/imbecis</A>.
	</P>

	<Heading id="remover" tag="h3" class="mb-2">Pedidos de Remoção</Heading>

	<P class="mb-7 text-justify">
		Se a sua matrícula ou face está visível e deseja removê-la, envie um email para <A
			href="mailto:remover@imbecis.app">remover@imbecis.app</A
		>. A remoção é feita manualmente e será efetuada tão rápido quanto possível.
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
</Content>
