:begin

merge (m:Mail {
    messageId: '<Pine.OSF.4.10.10001031848130.15764-100000@sable.ox.ac.uk>',
    subject: 'ernst juenger stipendium',
    timestamp: apoc.date.parse('2000-01-03T18:49:16.000Z', 'ms', "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"),
    date: '2000-01-03T18:49:16.000Z',
    text: "aus Marbach erhalten:\n\nHerr Direktor Dr. Ott, der Sie herzlich gruessen laesst,  bittet Sie\nfreundlich darum, daß Sie in Ihre Juenger-mailing-list die Ausschreibung\ndes Ernst-Juenger-Stipendiums des Ministerpraesidenten des Landes\nBaden-Wuerttemberg aufnehmen Wir schicken Ihnen heute per Luftpost die\nKopien. Sie koennen sich aber nach Erhalt dieser mail direkt unter der\nWWW-Adresse\n\n\nhttp://www.elfi.ruhr-uni-bochum.de/begleit/doks/EJSt.htm\n\ndie Ausschreibung selbst auf Ihren PC laden.\n\nDies mit herzlichem Gruss aus Marbach, auch von Herrn Direktor Dr. Ott,\n\n\nMargit Berger\nSekretariat Handschriftenabteilung\nDeutsches Literaturarchiv\nPostfach 1162\nD-71666 Marbach a.N.\nTel.: 0049-7144-848-401\nFax:  0049-7144-848-490\n\n\nP.S.: Herr Dr. Meyer ist noch im Weihnachtsurlaub und wird ab 10.1.2000\nwieder in Marbach sein.\n\n\n\n\n"
});

merge (a:Address {
    address: "john.king@st-johns.oxford.ac.uk"
});

merge (n:Name {
    name: "John King"
});

MATCH (m:Mail {messageId: '<Pine.OSF.4.10.10001031848130.15764-100000@sable.ox.ac.uk>'})
MATCH (a:Address {address: "john.king@st-johns.oxford.ac.uk"})
MERGE (m)-[:FROM]->(a);


MATCH (a:Address {address: "john.king@st-johns.oxford.ac.uk"})
MATCH (n:Name {name: "John King"})
MERGE (a)-[:HAS_NAME]->(n);

:commit
