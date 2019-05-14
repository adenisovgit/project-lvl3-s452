export const feedTemplate = `<div class="card" id="cardTemplate">
<div class="card-header pt-1 pb-1 pl-4 ">
  <h5 class="mb-0">
    <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
    <button id="rssheadbuttonTemplate" class="btn btn-link collapsed" type="button" data-toggle="collapse" data-target="#collapseTemplate" aria-expanded="true" aria-controls="collapseTemplate">
    </button>
  </h5>
</div>
<div id="collapseTemplate" class="collapse pt-3 pb-3 pl-5" aria-labelledby="headingTemplate" data-parent="#feedsAccordion">
  <div class="card-body" id="cardbodyTemplate">
  </div>
</div>
</div>`;

export const xmlTestString1 = `<note>
<to>Tove</to>
<from>Jani</from>
<heading>Reminder</heading>
<body>Don't forget me this weekend!</body>
</note>`;

export const xmlTestString2 = '<?xml version="1.0" encoding="UTF-8"?><rss xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom" version="2.0"><channel><title><![CDATA[Lorem ipsum feed for an interval of 1 minutes]]></title><description><![CDATA[This is a constantly updating lorem ipsum feed]]></description><link>http://example.com/</link><generator>RSS for Node</generator><lastBuildDate>Sat, 11 May 2019 11:35:41 GMT</lastBuildDate><pubDate>Sat, 11 May 2019 11:35:00 GMT</pubDate><copyright><![CDATA[Michael Bertolacci, licensed under a Creative Commons Attribution 3.0 Unported License.]]></copyright><ttl>1</ttl><item><title><![CDATA[Lorem ipsum 2019-05-11T11:35:00Z]]></title><description><![CDATA[Quis in sit est nisi do mollit aliqua adipisicing.]]></description><link>http://example.com/test/1557574500</link><guid isPermaLink="true">http://example.com/test/1557574500</guid><dc:creator><![CDATA[John Smith]]></dc:creator><pubDate>Sat, 11 May 2019 11:35:00 GMT</pubDate></item><item><title><![CDATA[Lorem ipsum 2019-05-11T11:34:00Z]]></title><description><![CDATA[Esse reprehenderit voluptate labore exercitation ipsum et incididunt qui ullamco ad.]]></description><link>http://example.com/test/1557574440</link><guid isPermaLink="true">http://example.com/test/1557574440</guid><dc:creator><![CDATA[John Smith]]></dc:creator><pubDate>Sat, 11 May 2019 11:34:00 GMT</pubDate></item><item><title><![CDATA[Lorem ipsum 2019-05-11T11:33:00Z]]></title><description><![CDATA[Ullamco veniam ut qui labore ex adipisicing proident.]]></description><link>http://example.com/test/1557574380</link><guid isPermaLink="true">http://example.com/test/1557574380</guid><dc:creator><![CDATA[John Smith]]></dc:creator><pubDate>Sat, 11 May 2019 11:33:00 GMT</pubDate></item><item><title><![CDATA[Lorem ipsum 2019-05-11T11:32:00Z]]></title><description><![CDATA[Qui ipsum esse aute nostrud minim est et esse sunt dolore.]]></description><link>http://example.com/test/1557574320</link><guid isPermaLink="true">http://example.com/test/1557574320</guid><dc:creator><![CDATA[John Smith]]></dc:creator><pubDate>Sat, 11 May 2019 11:32:00 GMT</pubDate></item><item><title><![CDATA[Lorem ipsum 2019-05-11T11:31:00Z]]></title><description><![CDATA[Lorem est mollit cupidatat excepteur et mollit magna aliquip occaecat eiusmod voluptate.]]></description><link>http://example.com/test/1557574260</link><guid isPermaLink="true">http://example.com/test/1557574260</guid><dc:creator><![CDATA[John Smith]]></dc:creator><pubDate>Sat, 11 May 2019 11:31:00 GMT</pubDate></item><item><title><![CDATA[Lorem ipsum 2019-05-11T11:30:00Z]]></title><description><![CDATA[Sint pariatur Lorem elit officia elit deserunt aute sit duis eiusmod.]]></description><link>http://example.com/test/1557574200</link><guid isPermaLink="true">http://example.com/test/1557574200</guid><dc:creator><![CDATA[John Smith]]></dc:creator><pubDate>Sat, 11 May 2019 11:30:00 GMT</pubDate></item><item><title><![CDATA[Lorem ipsum 2019-05-11T11:29:00Z]]></title><description><![CDATA[Nulla occaecat occaecat cupidatat culpa nisi ullamco reprehenderit elit.]]></description><link>http://example.com/test/1557574140</link><guid isPermaLink="true">http://example.com/test/1557574140</guid><dc:creator><![CDATA[John Smith]]></dc:creator><pubDate>Sat, 11 May 2019 11:29:00 GMT</pubDate></item><item><title><![CDATA[Lorem ipsum 2019-05-11T11:28:00Z]]></title><description><![CDATA[Proident incididunt aute reprehenderit in enim labore.]]></description><link>http://example.com/test/1557574080</link><guid isPermaLink="true">http://example.com/test/1557574080</guid><dc:creator><![CDATA[John Smith]]></dc:creator><pubDate>Sat, 11 May 2019 11:28:00 GMT</pubDate></item><item><title><![CDATA[Lorem ipsum 2019-05-11T11:27:00Z]]></title><description><![CDATA[Quis ea veniam aliqua veniam laboris ipsum aliquip aliquip consequat proident esse in ullamco velit.]]></description><link>http://example.com/test/1557574020</link><guid isPermaLink="true">http://example.com/test/1557574020</guid><dc:creator><![CDATA[John Smith]]></dc:creator><pubDate>Sat, 11 May 2019 11:27:00 GMT</pubDate></item><item><title><![CDATA[Lorem ipsum 2019-05-11T11:26:00Z]]></title><description><![CDATA[In consequat consequat amet qui quis.]]></description><link>http://example.com/test/1557573960</link><guid isPermaLink="true">http://example.com/test/1557573960</guid><dc:creator><![CDATA[John Smith]]></dc:creator><pubDate>Sat, 11 May 2019 11:26:00 GMT</pubDate></item></channel></rss>';
