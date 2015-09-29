# Telkku.com recording temp stuff

## TOC
<!-- MarkdownTOC autolink=true autoanchor=true bracket=round -->

- [CSS](#css)
- [HTML](#html)
- [JS](#js)
- [MISC Telkku.com](#misc-telkkucom)
- [Telkku - DNA TV -hakuintegraatio](#telkku---dna-tv--hakuintegraatio)
	- [Telkku](#telkku)
	- [DNA TV](#dna-tv)
	- [MISC DNA TV](#misc-dna-tv)

<!-- /MarkdownTOC -->


## CSS <a name="css"></a>

	.test_record {
		position: absolute;
		top: 60px;
		left: 10px;
	}

## HTML <a name="html"></a>

	<span id="test_record_11" class="test_record"></span>


## JS <a name="js"></a>

	$( '#test_record_11' ).load( '/program/show/20150511170017 #recordProgram' );
	$( '#recordProgram' ).attr('onclick', 'record(11, 20150511170017); return false;')

	function record(no, id) {
		app.recorder.record(id);
		$( '#test_record_' + no ).load( '/program/show/20150511170017 #playProgram' );
	}


## MISC Telkku.com <a name="misc-telkkucom"></a>

<http://www.telkku.com/search?searchText=Historian+salaiset+kansiot&isPartial=0&searchFields=name&startDate=&endDate=&type=all>

<https://api.jquery.com/load/>


## Telkku - DNA TV -hakuintegraatio <a name="telkku---dna-tv--hakuintegraatio"></a>

### Telkku <a name="telkku"></a>

Sivun URL muotoa: <http://classic.telkku.com/program/show/2015090718009>

"2015090718009" on ohjelman ID, joka vaihtuu

Telkun sivulatauksen jälkeen ajetaan seuraava:

	searchUrl = 'https://tv.dna.fi/webui/epg' + '?customsearch=' + $('#programName').text().trim().replace(/ /g, '+').replace(/&/g, '%26');
	$elem = '<li><a href="' + searchUrl + '" target="_blank" title="DNA TV" class="btn">DNA TV</a></li>';
	$('nav.oti-outbound-nav:first ul').append($elem);

### DNA TV <a name="dna-tv"></a>

Sivun URL muotoa: <https://tv.dna.fi/webui/epg?customsearch=Men+in+Black+II+-+Miehet+mustissa+II>

"Men+in+Black+II+-+Miehet+mustissa+II" on haettava nimi, "+"-merkit korvataan välilyönneillä ja "%26"-enkoodaukset "&"-merkillä

DNA TV:n sivulatauksen jälkeen ajetaan seuraava:

	$('#keyword').val(decodeURI(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + encodeURI('customsearch').replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1")).replace(/%26/g, '&').replace(/\+/g,' '));
	$('#search-btn').click();

### MISC DNA TV <a name="misc-dna-tv"></a>

<http://www.telkku.com/ohjelmat/viattomuuden-aika/107647/frii/624045>

<https://tv.dna.fi/images/matkatv/logo_dnatv.png>

HTML:

	<li class="card__external_links_item ng-scope" ng-repeat="link in ::card.externalLinks">
		<a href="https://tv.dna.fi/webui/epg?customsearch=Viattomuuden+aika" target="_blank" title="Ohjelmaan liittyvä haku DNA TV:ssä">
			<img src="https://tv.dna.fi/images/matkatv/logo_dnatv.png" alt="Ohjelmaan liittyvä haku DNA TV:ssä" style="
				max-width: 10rem;
				max-height: 6.875rem;
			">
		</a>
	</li>

JS:

	$('h1.page__title span.ng-binding')

GM:

	// @match http://classic.telkku.com/program/show/*
	// @match http://www.telkku.com/ohjelmat/*

- 1
- 2
- 3
- 4
- 5
- 6
- 7
- 8
- 8
- 9
- 11
- 12
- 13
- 14
- 15
- 16
- 17
- 18
- 19
- 20
- 21
