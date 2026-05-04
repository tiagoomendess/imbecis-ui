<script lang="ts">
	import { Heading, P, A, List, Li } from 'flowbite-svelte';
	import Content from '$lib/components/Content.svelte';
	const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

	const exampleBase = BASE_URL.replace(/\/$/, '');
</script>

<svelte:head>
	<title>Imbecis :: Programadores</title>
	<meta
		name="description"
		content="Documentação da API pública Imbecis: listagem de denúncias confirmadas (GET /reports/confirmed)."
	/>
	<meta property="og:image" content="/imbecis_logo_300.png" />
</svelte:head>

<Content fullWidth>
	<div class="developers-api-doc mx-auto max-w-4xl px-4 py-4 pb-24">
		<Heading tag="h1" class="mb-3 text-2xl font-bold">API para programadores</Heading>
		<P class="mb-6 text-gray-600 dark:text-gray-300">
			Esta página descreve os endpoints públicos que pode usar para integrar com o Imbecis. Não é
			necessária autenticação para o endpoint documentado abaixo.
		</P>

		<P class="mb-6 text-sm text-gray-500 dark:text-gray-400">
			URL base da API neste ambiente:
			<code class="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-xs dark:bg-gray-800">{BASE_URL}</code>
		</P>

		<section class="mb-10" id="get-confirmed">
			<Heading tag="h2" class="mb-3 text-xl">GET /reports/confirmed</Heading>
			<P class="mb-4 text-gray-600 dark:text-gray-300">
				Devolve uma lista paginada de denúncias públicas confirmadas, ordenadas pela ocorrência mais
				recente primeiro.
			</P>

			<Heading tag="h3" class="mb-2 text-lg">Pedido</Heading>
			<pre
				class="mb-4 overflow-x-auto rounded-lg border border-gray-200 bg-gray-50 p-3 text-xs leading-relaxed dark:border-gray-700 dark:bg-gray-900"
			><code>GET /reports/confirmed</code></pre>
			<P class="mb-2 text-sm font-medium text-gray-700 dark:text-gray-200">Parâmetros de query</P>
			<div class="mb-6 overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
				<table class="w-full min-w-[640px] text-left text-sm text-gray-700 dark:text-gray-200">
					<thead class="bg-gray-100 text-xs uppercase dark:bg-gray-800">
						<tr>
							<th class="px-3 py-2 font-semibold">Parâmetro</th>
							<th class="px-3 py-2 font-semibold">Tipo</th>
							<th class="px-3 py-2 font-semibold">Obrig.</th>
							<th class="px-3 py-2 font-semibold">Predefinição</th>
							<th class="px-3 py-2 font-semibold">Restrições</th>
							<th class="px-3 py-2 font-semibold">Descrição</th>
						</tr>
					</thead>
					<tbody class="divide-y divide-gray-200 dark:divide-gray-700">
						<tr>
							<td class="px-3 py-2 font-mono text-xs">page</td>
							<td class="px-3 py-2">integer</td>
							<td class="px-3 py-2">Não</td>
							<td class="px-3 py-2 font-mono">1</td>
							<td class="px-3 py-2">≥ 1</td>
							<td class="px-3 py-2">Número da página.</td>
						</tr>
						<tr>
							<td class="px-3 py-2 font-mono text-xs">pageSize</td>
							<td class="px-3 py-2">integer</td>
							<td class="px-3 py-2">Não</td>
							<td class="px-3 py-2 font-mono">10</td>
							<td class="px-3 py-2">5 – 50</td>
							<td class="px-3 py-2">Resultados por página.</td>
						</tr>
						<tr>
							<td class="px-3 py-2 font-mono text-xs">from_time</td>
							<td class="px-3 py-2">string</td>
							<td class="px-3 py-2">Não</td>
							<td class="px-3 py-2">—</td>
							<td class="px-3 py-2">ISO 8601</td>
							<td class="px-3 py-2">
								Limite inferior no tempo da ocorrência (<code class="font-mono text-xs">occurredAt</code
								>, com recurso a <code class="font-mono text-xs">createdAt</code> em relatórios antigos).
							</td>
						</tr>
						<tr>
							<td class="px-3 py-2 font-mono text-xs">to_time</td>
							<td class="px-3 py-2">string</td>
							<td class="px-3 py-2">Não</td>
							<td class="px-3 py-2">—</td>
							<td class="px-3 py-2">ISO 8601, ≥ from_time</td>
							<td class="px-3 py-2">Limite superior (mesma lógica de fallback que <code class="font-mono text-xs">from_time</code>).</td>
						</tr>
						<tr>
							<td class="px-3 py-2 font-mono text-xs">municipality</td>
							<td class="px-3 py-2">string</td>
							<td class="px-3 py-2">Não</td>
							<td class="px-3 py-2">—</td>
							<td class="px-3 py-2">Município português válido</td>
							<td class="px-3 py-2">
								Filtra pelo campo <code class="font-mono text-xs">municipality</code> do relatório
								(geocodificação).
							</td>
						</tr>
					</tbody>
				</table>
			</div>

			<Heading tag="h3" class="mb-2 text-lg">Exemplos de URL completas</Heading>
			<P class="mb-2 text-sm text-gray-600 dark:text-gray-300">Primeira página (predefinições):</P>
			<pre
				class="mb-3 overflow-x-auto rounded-lg border border-gray-200 bg-gray-50 p-3 text-xs dark:border-gray-700 dark:bg-gray-900"
			><code>GET {exampleBase}/reports/confirmed</code></pre>

			<P class="mb-2 text-sm text-gray-600 dark:text-gray-300">Página 2, 25 resultados, Braga:</P>
			<pre
				class="mb-3 overflow-x-auto rounded-lg border border-gray-200 bg-gray-50 p-3 text-xs dark:border-gray-700 dark:bg-gray-900"
			><code>GET {exampleBase}/reports/confirmed?page=2&pageSize=25&municipality=Braga</code></pre>

			<P class="mb-2 text-sm text-gray-600 dark:text-gray-300">Janela temporal:</P>
			<pre
				class="mb-6 overflow-x-auto rounded-lg border border-gray-200 bg-gray-50 p-3 text-xs dark:border-gray-700 dark:bg-gray-900"
			><code
					>GET {exampleBase}/reports/confirmed?from_time=2026-04-01T00:00:00.000Z&to_time=2026-04-30T23:59:59.999Z</code
				></pre>

			<Heading tag="h3" class="mb-2 text-lg">Resposta: 200 OK</Heading>
			<pre
				class="mb-6 overflow-x-auto rounded-lg border border-gray-200 bg-gray-50 p-3 text-xs leading-relaxed dark:border-gray-700 dark:bg-gray-900"
			><code>{`{
  "success": true,
  "message": "Confirmed reports",
  "meta": {
    "page": 1,
    "pageSize": 10,
    "total": 84,
    "totalPages": 9
  },
  "payload": [
    {
      "id": "69f3a084f3a164e5562c4d20",
      "occurredAt": "2026-04-30T14:22:00.000Z",
      "createdAt": "2026-04-30T14:23:11.000Z",
      "picture": "https://cdn.imbecis.app/reports/69f3a084f3a164e5562c4d20.jpg",
      "plateNumber": "AA-00-BB",
      "plateCountry": "pt",
      "location": {
        "latitude": 41.54321,
        "longitude": -8.42109,
        "municipality": "Braga",
        "freguesia": "Maximinos",
        "street": "Rua de Santa Margarida",
        "doorNumber": 12,
        "postal_code": "4710-306"
      }
    }
  ]
}`}</code></pre>

			<Heading tag="h3" class="mb-2 text-lg">Campos do corpo (nível superior)</Heading>
			<div class="mb-6 overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
				<table class="w-full text-left text-sm text-gray-700 dark:text-gray-200">
					<thead class="bg-gray-100 text-xs uppercase dark:bg-gray-800">
						<tr>
							<th class="px-3 py-2 font-semibold">Campo</th>
							<th class="px-3 py-2 font-semibold">Tipo</th>
							<th class="px-3 py-2 font-semibold">Descrição</th>
						</tr>
					</thead>
					<tbody class="divide-y divide-gray-200 dark:divide-gray-700">
						<tr>
							<td class="px-3 py-2 font-mono text-xs">success</td>
							<td class="px-3 py-2">boolean</td>
							<td class="px-3 py-2">Sempre <code class="font-mono text-xs">true</code> em sucesso.</td>
						</tr>
						<tr>
							<td class="px-3 py-2 font-mono text-xs">message</td>
							<td class="px-3 py-2">string</td>
							<td class="px-3 py-2">Mensagem legível.</td>
						</tr>
						<tr>
							<td class="px-3 py-2 font-mono text-xs">meta</td>
							<td class="px-3 py-2">object</td>
							<td class="px-3 py-2">Metadados de paginação.</td>
						</tr>
						<tr>
							<td class="px-3 py-2 font-mono text-xs">payload</td>
							<td class="px-3 py-2">array</td>
							<td class="px-3 py-2">Lista de denúncias confirmadas.</td>
						</tr>
					</tbody>
				</table>
			</div>

			<Heading tag="h3" class="mb-2 text-lg">meta</Heading>
			<div class="mb-6 overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
				<table class="w-full text-left text-sm text-gray-700 dark:text-gray-200">
					<thead class="bg-gray-100 text-xs uppercase dark:bg-gray-800">
						<tr>
							<th class="px-3 py-2 font-semibold">Campo</th>
							<th class="px-3 py-2 font-semibold">Tipo</th>
							<th class="px-3 py-2 font-semibold">Descrição</th>
						</tr>
					</thead>
					<tbody class="divide-y divide-gray-200 dark:divide-gray-700">
						<tr>
							<td class="px-3 py-2 font-mono text-xs">page</td>
							<td class="px-3 py-2">integer</td>
							<td class="px-3 py-2">Página atual.</td>
						</tr>
						<tr>
							<td class="px-3 py-2 font-mono text-xs">pageSize</td>
							<td class="px-3 py-2">integer</td>
							<td class="px-3 py-2">Itens por página nesta resposta.</td>
						</tr>
						<tr>
							<td class="px-3 py-2 font-mono text-xs">total</td>
							<td class="px-3 py-2">integer</td>
							<td class="px-3 py-2">Total de registos que correspondem ao filtro.</td>
						</tr>
						<tr>
							<td class="px-3 py-2 font-mono text-xs">totalPages</td>
							<td class="px-3 py-2">integer</td>
							<td class="px-3 py-2">Total de páginas; <code class="font-mono text-xs">0</code> se <code class="font-mono text-xs">total</code> for <code class="font-mono text-xs">0</code>.</td>
						</tr>
					</tbody>
				</table>
			</div>

			<Heading tag="h3" class="mb-2 text-lg">Itens em payload[]</Heading>
			<div class="mb-6 overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
				<table class="w-full min-w-[560px] text-left text-sm text-gray-700 dark:text-gray-200">
					<thead class="bg-gray-100 text-xs uppercase dark:bg-gray-800">
						<tr>
							<th class="px-3 py-2 font-semibold">Campo</th>
							<th class="px-3 py-2 font-semibold">Tipo</th>
							<th class="px-3 py-2 font-semibold">Descrição</th>
						</tr>
					</thead>
					<tbody class="divide-y divide-gray-200 dark:divide-gray-700">
						<tr>
							<td class="px-3 py-2 font-mono text-xs">id</td>
							<td class="px-3 py-2">string</td>
							<td class="px-3 py-2">ObjectId MongoDB em hexadecimal.</td>
						</tr>
						<tr>
							<td class="px-3 py-2 font-mono text-xs">occurredAt</td>
							<td class="px-3 py-2">string</td>
							<td class="px-3 py-2">ISO 8601 — quando a infração foi observada; em relatórios antigos pode coincidir com <code class="font-mono text-xs">createdAt</code>.</td>
						</tr>
						<tr>
							<td class="px-3 py-2 font-mono text-xs">createdAt</td>
							<td class="px-3 py-2">string</td>
							<td class="px-3 py-2">ISO 8601 — quando a denúncia foi submetida.</td>
						</tr>
						<tr>
							<td class="px-3 py-2 font-mono text-xs">picture</td>
							<td class="px-3 py-2">string | null</td>
							<td class="px-3 py-2">URL pública da imagem (matrícula desfocada); <code class="font-mono text-xs">null</code> se não houver.</td>
						</tr>
						<tr>
							<td class="px-3 py-2 font-mono text-xs">plateNumber</td>
							<td class="px-3 py-2">string | null</td>
							<td class="px-3 py-2">Matrícula; <code class="font-mono text-xs">null</code> se não confirmada.</td>
						</tr>
						<tr>
							<td class="px-3 py-2 font-mono text-xs">plateCountry</td>
							<td class="px-3 py-2">string | null</td>
							<td class="px-3 py-2">Código ISO do país da matrícula (ex.: <code class="font-mono text-xs">pt</code>).</td>
						</tr>
						<tr>
							<td class="px-3 py-2 font-mono text-xs">location</td>
							<td class="px-3 py-2">object</td>
							<td class="px-3 py-2">Localização (ver tabela seguinte).</td>
						</tr>
					</tbody>
				</table>
			</div>

			<Heading tag="h3" class="mb-2 text-lg">location</Heading>
			<div class="mb-6 overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
				<table class="w-full text-left text-sm text-gray-700 dark:text-gray-200">
					<thead class="bg-gray-100 text-xs uppercase dark:bg-gray-800">
						<tr>
							<th class="px-3 py-2 font-semibold">Campo</th>
							<th class="px-3 py-2 font-semibold">Tipo</th>
							<th class="px-3 py-2 font-semibold">Descrição</th>
						</tr>
					</thead>
					<tbody class="divide-y divide-gray-200 dark:divide-gray-700">
						<tr>
							<td class="px-3 py-2 font-mono text-xs">latitude</td>
							<td class="px-3 py-2">number</td>
							<td class="px-3 py-2">Arredondada a 5 casas decimais.</td>
						</tr>
						<tr>
							<td class="px-3 py-2 font-mono text-xs">longitude</td>
							<td class="px-3 py-2">number</td>
							<td class="px-3 py-2">Arredondada a 5 casas decimais.</td>
						</tr>
						<tr>
							<td class="px-3 py-2 font-mono text-xs">municipality</td>
							<td class="px-3 py-2">string | undefined</td>
							<td class="px-3 py-2">Município (geocodificação).</td>
						</tr>
						<tr>
							<td class="px-3 py-2 font-mono text-xs">freguesia</td>
							<td class="px-3 py-2">string | undefined</td>
							<td class="px-3 py-2">Freguesia.</td>
						</tr>
						<tr>
							<td class="px-3 py-2 font-mono text-xs">street</td>
							<td class="px-3 py-2">string | undefined</td>
							<td class="px-3 py-2">Nome da rua.</td>
						</tr>
						<tr>
							<td class="px-3 py-2 font-mono text-xs">doorNumber</td>
							<td class="px-3 py-2">integer | undefined</td>
							<td class="px-3 py-2">Número de porta.</td>
						</tr>
						<tr>
							<td class="px-3 py-2 font-mono text-xs">postal_code</td>
							<td class="px-3 py-2">string | undefined</td>
							<td class="px-3 py-2">Código postal (ex.: <code class="font-mono text-xs">4710-306</code>).</td>
						</tr>
					</tbody>
				</table>
			</div>

			<Heading tag="h3" class="mb-2 text-lg">Erros: 400 Bad Request</Heading>
			<P class="mb-3 text-sm text-gray-600 dark:text-gray-300">
				Devolvido quando os parâmetros de query falham a validação.
			</P>
			<pre
				class="mb-4 overflow-x-auto rounded-lg border border-gray-200 bg-gray-50 p-3 text-xs leading-relaxed dark:border-gray-700 dark:bg-gray-900"
			><code>{`{
  "success": false,
  "errors": [
    "pageSize must not be less than 5",
    "municipality is not a valid municipality"
  ]
}`}</code></pre>

			<div class="mb-6 overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
				<table class="w-full min-w-[520px] text-left text-sm text-gray-700 dark:text-gray-200">
					<thead class="bg-gray-100 text-xs uppercase dark:bg-gray-800">
						<tr>
							<th class="px-3 py-2 font-semibold">Condição</th>
							<th class="px-3 py-2 font-semibold">Mensagem (exemplo)</th>
						</tr>
					</thead>
					<tbody class="divide-y divide-gray-200 dark:divide-gray-700">
						<tr>
							<td class="px-3 py-2"><code class="font-mono text-xs">page</code> &lt; 1</td>
							<td class="px-3 py-2 font-mono text-xs">page must not be less than 1</td>
						</tr>
						<tr>
							<td class="px-3 py-2"><code class="font-mono text-xs">pageSize</code> fora de 5 – 50</td>
							<td class="px-3 py-2 font-mono text-xs">pageSize must not be less than 5 / must not be greater than 50</td>
						</tr>
						<tr>
							<td class="px-3 py-2"><code class="font-mono text-xs">from_time</code> inválido</td>
							<td class="px-3 py-2 font-mono text-xs">from_time must be a valid ISO date string</td>
						</tr>
						<tr>
							<td class="px-3 py-2"><code class="font-mono text-xs">to_time</code> inválido</td>
							<td class="px-3 py-2 font-mono text-xs">to_time must be a valid ISO date string</td>
						</tr>
						<tr>
							<td class="px-3 py-2"><code class="font-mono text-xs">from_time</code> &gt; <code class="font-mono text-xs">to_time</code></td>
							<td class="px-3 py-2 font-mono text-xs">from_time must be earlier than or equal to to_time</td>
						</tr>
						<tr>
							<td class="px-3 py-2"><code class="font-mono text-xs">municipality</code> inválido</td>
							<td class="px-3 py-2 font-mono text-xs">municipality is not a valid municipality</td>
						</tr>
					</tbody>
				</table>
			</div>

			<Heading tag="h3" class="mb-2 text-lg">Notas</Heading>
			<List class="mb-8 list-disc space-y-2 pl-5 text-sm text-gray-700 dark:text-gray-200">
				<Li>
					<strong>Ordenação:</strong> por <code class="font-mono text-xs">occurredAt</code> decrescente;
					registos sem esse campo usam <code class="font-mono text-xs">createdAt</code> para ordenação e tendem a aparecer depois dos mais recentes com
					<code class="font-mono text-xs">occurredAt</code> explícito.
				</Li>
				<Li>
					<strong>Filtro <code class="font-mono text-xs">municipality</code>:</strong> corresponde ao campo de topo do relatório preenchido por geocodificação,
					não pesquisa dentro de <code class="font-mono text-xs">geoInfo</code>.
				</Li>
				<Li>
					<strong>Campos geográficos opcionais:</strong> <code class="font-mono text-xs">municipality</code>, <code class="font-mono text-xs">freguesia</code>,
					<code class="font-mono text-xs">street</code>, <code class="font-mono text-xs">doorNumber</code> e <code class="font-mono text-xs">postal_code</code> em
					<code class="font-mono text-xs">location</code> podem ser omitidos se ainda não houver enriquecimento ou o geocoder não devolver valor.
				</Li>
				<Li>
					<strong>Autenticação:</strong> endpoint público, sem credenciais.
				</Li>
			</List>
		</section>
	</div>
</Content>

<style lang="postcss">
	@reference "../../app.css";

	/* Flowbite sets code color without dark variants; fix contrast in API doc blocks */
	.developers-api-doc :global(code) {
		@apply text-gray-800 dark:text-gray-200;
	}
	.developers-api-doc :global(pre) {
		@apply text-gray-900 dark:text-gray-100;
	}
	.developers-api-doc :global(pre code) {
		@apply text-inherit;
	}
</style>
