<script lang="ts">
	import { P, Heading, Img, A } from 'flowbite-svelte';
	import Content from '$lib/components/Content.svelte';

	const videoLinks = [
		'https://www.youtube.com/embed/uxykI30fS54?si=G69w3rtm-yEpiqbj',
		'https://www.youtube.com/embed/Ie5hOGMsgNQ?si=dY1a1gquLQ0lM9IH',
		'https://www.youtube.com/embed/V1kOLhhSjl8?si=92qmsOK382Ve2Ybw',
		'https://www.youtube.com/embed/UabSO0X1rYw?si=JapmG6EcR6cwiTVq',
		'https://www.youtube.com/embed/N4PW66_g6XA?si=YzWM2glBhKXYA3aG',
		'https://www.youtube.com/embed/jN7mSXMruEo?si=oPHwzRt-74sXYjut',
		'https://www.youtube.com/embed/YpuX-5E7xoU?si=Vy8aZnHIuozuzhJg',
		'https://www.youtube.com/embed/ORzNZUeUHAM?si=DkDEubHPyG_t-UuE',
		'https://www.youtube.com/embed/OZ1HhLq-Huo?si=U8DlevO-gmrEjLz4',
		'https://www.youtube.com/embed/2z7o3sRxA5g?si=NMu_89yycJpiC0X7',
		'https://www.youtube.com/embed/bQld7iJJSyk?si=hhQyGribY4JLYLqC',
		'https://www.youtube.com/embed/CHZwOAIect4?si=36k6vbGMVxOcAQ_T',
		'https://www.youtube.com/embed/uwJeOQVxVZY?si=C9Hy8pX7rLNfelG2',
		'https://www.youtube.com/embed/tI3kkk2JdoI?si=j7JqmejGgIu7lFmv',
		'https://www.youtube.com/embed/7IsMeKl-Sv0?si=h-2zeDNlMY6pD2aL',
		'https://www.youtube.com/embed/7Nw6qyyrTeI?si=okZRj7sHWQ6CTXj6',
		'https://www.youtube.com/embed/RYsqWIGyRVk?si=luuC8MuCeQy5oIul',
		'https://www.youtube.com/embed/6QjKWciU74o?si=r0CyFjnzZ9FluzIR',
		'https://www.youtube.com/embed/bAxRYrpbnuA?si=pD-kB1ohx7QkA5zY',
		'https://www.youtube.com/embed/Rs7jHvh7v-4?si=AqFGP4lukf_UTtUq'
	];
</script>

<Content>
	<div>
		<Heading tag="h2" class="mb-5">Continue a Ler</Heading>
		<P class="mb-3 text-justify">
			Este não é o único modo de vida possível, esta realidade de dependência total do carro é
			relativamente recente, e até há bem pouco tempo ninguem precisava de um carro para ir para a
			escola ou fazer compras. É insustentável para o ambiente, e não, os carros elétricos não
			resolvem esta questão. Mas é principalmente economicamente insustentável tanto para as
			autarquias como para as pessoas.
		</P>
		<P class="mb-3 text-justify">
			O peso que a infraestrutura para o automóvel tem nos orçamentos das nossas autarquias é
			asfixiante, e deixa outros serviços essenciais sub financiados. Os preços dos automóveis
			aumentam a um ritmo mais elevado que a inflação, a sua manutenção é um scam e os produtores de
			combustíveis limitam propositadamente a oferta para manter os preços artificialmente altos.
			Está a ser burlado, a gostar e a pedir mais do mesmo.
		</P>
		<P class="mb-3 text-justify">
			Para além disso, o espaço que alocamos para infraestrutura automóvel nas nossas cidades é um
			absurdo. O automóvel privado é o meio de transporte menos eficiente de todos para realizar
			deslocações urbanas pela sua reduzida ocupação, e pelo imenso espaço que ocupa tanto a
			circular, como depois 99% do tempo que não está a ser usado e está estacionado. Ocupando
			muitas das vezes, o espaço mais valioso e desejado, que são os centros históricos.
		</P>
		<P class="mb-3 text-justify">
			Não precisa de deixar por completo o seu automóvel, mas estacione legalmente um pouco mais
			longe e caminhe 5 minutos a pé até ao destino. Em alturas mais congestionadas, use Transportes
			Públicos. Use uma bicicleta se for preciso, ocupa muito menos espaço que um carro. Em lado
			nenhum está escrito que existe um direito irrevogável de deixar o automóvel à porta de onde
			queremos ir. Exija alternativas ao poder político local para não ser obrigado a conduzir
			tanto, conduza porque quer e não porque é forçado, e poupe dinheiro com isso. É a falta de
			alternativas viáveis que torna o problema pior.
		</P>
		<Heading tag="h2" class="mb-5">Por Exemplo</Heading>
		<P class="mb-3 text-justify">
			O exemplo mais completo da ineficiência do automóvel como meio de transporte é a cidade de
			Houston nos Estados Unidos, que em 1920 era algo como assim:
		</P>
		<Img class="rounded-lg mb-3" src="/houston_1920.jpg" alt="Houston nos Estados Unidos em 1920" />
		<P class="mb-3 text-justify">
			E algumas décadas de políticas de planeamento urbano centradas no automóvel depois, a cidade
			ficou assim:
		</P>
		<Img class="rounded-lg mb-3" src="/houston_1980.jpg" alt="Houston nos Estados Unidos em 1920" />
		<P class="mb-3 text-justify">
			Não, não é um circuito eletrónico, nem caiu ali uma bomba nuclear, eles fizeram isto de
			propósito a eles próprios. É apenas mais estacionamento do que sítios para viver, estudar e
			trabalhar. Estacionamento gratuito não falta, mas negócios e habitações que são quem pagam
			impostos e evitam a bancarrota da cidade há menos, muito menos. E se não tiver dinheiro para
			carro ou se não pode conduzir por motivos de saúde, temos pena, não há vida para si. <b
				>É isto que estamos a pedir?</b
			>
		</P>
		<P class="mb-3 text-justify">
			Entretanto a cidade de Houston já reconheceu o erro e está a tentar corrigir, e hojé já não
			está assim, mas é um processo lento, doloroso e caro.
		</P>
		<Heading tag="h2" class="mb-5">Eduque-se</Heading>
		<P class="mb-3 text-justify">
			Pesquise sobre "Induced Demand" (Demanda Induzida), "Transid Oriented Development"
			(Desenvolvimento Orientado a Transportes), "Urban Sprawl" (Expansão Urbana), "Traffic Calming"
			(Tranquilização do Tráfego) e "Car Centric Design" (Design Centrado no Automóvel).
		</P>
		<P class="mb-3 text-justify">
			Eduque-se sobre planeamento urbanístico e mobilidade sustentável lendo em
			<A href="https://www.reddit.com/r/menoscarros/" target="_blank">r/menoscarros</A> e
			<A href="https://www.strongtowns.org/" target="_blank">strongtowns.org</A>, ou assistindo aos
			vídeos nos canais de youtube de
			<A href="https://www.youtube.com/@strongtowns" target="_blank">@strongtowns</A>,
			<A href="https://www.youtube.com/@NotJustBikes" target="_blank">@NotJustBikes</A>,
			<A href="https://www.youtube.com/@AdamSomething" target="_blank">@AdamSomething</A>,
			<A href="https://www.youtube.com/@CityBeautiful" target="_blank">@CityBeautiful</A> e
			<A href="https://www.youtube.com/@ClimateTown" target="_blank">@ClimateTown</A>.
		</P>
		<P class="mb-3 text-justify"
			>Para começar pode assistir a este escolhido aleatóriamente: (Se não entender inglês legendas
			estão disponíveis)</P
		>
		<iframe
			class="mb-5 w-full aspect-[16/9] rounded-lg"
			src={videoLinks[Math.floor(Math.random() * videoLinks.length)]}
			title="YouTube video player"
			frameborder="0"
			allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
			referrerpolicy="strict-origin-when-cross-origin"
			allowfullscreen={true}
		></iframe>
		<P class="mb-3 text-justify">
			Se você é o dono deste veículo, coloque a mão na consciência e pense no impacto negativo que
			está a ter na vida dos outros com os seus comportamentos egoístas.
		</P>
		<P class="mb-3 text-justify">
			Se você é um autarca, arquiteto ou urbanista, reconsidere seriamente voltar a ler sobre
			urbanismo e atualizar-se para o século XXI. Não há grandes sinais de progresso na forma como
			ainda se constroi e se planeiam as nossas cidades. É urgente atualizarem-se, estão a causar
			dano na sociedade Portuguesa!
		</P>
	</div>
</Content>
