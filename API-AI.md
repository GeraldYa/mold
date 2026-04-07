MOLD API v0.1 — AI REFERENCE
BASE: http://localhost:3090
ALL BODIES: Content-Type: application/json
MERGE SEMANTICS: PUT merges fields, omitted fields unchanged.
i18n: any text field accepts string OR {"en":"...","zh":"...","fr":"...","es":"..."}.

ENDPOINTS:
GET /api/pages → [{id,title,file}]
GET /api/page/{P} → full mold json
POST /api/page body:{mold,page:{id,title},theme:{mood,accent},sections:[]} → {ok}
PUT /api/page/{P} body:{full json} → {ok}
DELETE /api/page/{P} → {ok}
GET /api/page/{P}/meta → {page,theme}
PUT /api/page/{P}/meta body:{page:{title?},theme:{mood?,accent?}} → {ok}
GET /api/page/{P}/sections → [{id,type,heading}]
GET /api/page/{P}/section/{S} → section object
POST /api/page/{P}/section body:{type,id,...} → {ok} (inserts before footer; _position:N for index)
PUT /api/page/{P}/section/{S} body:{field:value,...} → {ok}
DELETE /api/page/{P}/section/{S} → {ok}
PUT /api/page/{P}/section/{S}/move body:{to:N} → {ok}
POST /api/page/{P}/section/{S}/item body:{...item} → {ok,count}
PUT /api/page/{P}/section/{S}/item/{I} body:{field:value} → {ok}
DELETE /api/page/{P}/section/{S}/item/{I} → {ok}
GET /view/{P} → rendered HTML page

SECTION TYPES:
hero: name,tagline,links:[{label,url}],cta:{label,url,style}
stats: items:[{value,label}],animate:bool
timeline: heading,entries:[{year,text,pulse?:bool}]
cards: heading,columns:N,expandable:{visible:N,label},items:[{title,tech,description,image?,icon?,link:{label,url}|links:[{label,url}]}]
skills: heading,tags:["..."]
experience: heading,items:[{title,org,period,description}]
education: heading,items:[{title,org?,year?,detail?}]
writing: heading,items:[{title,description?,image?,icon?,link:{label,url}}]
features: heading,items:[{icon,title,description}]
contact: heading,text,links:[{label,url}]
footer: text

MOODS: professional-dark|professional-light|golden-hour|minimal|bold
ACCENTS: amber|purple|blue|green|red|rose|cyan
ERRORS: 400={error:"bad request"} 404={error:"not found"}

INTENT→CALL:
"change name"→PUT /section/intro {name:X}
"change tagline"→PUT /section/intro {tagline:X}
"add project"→POST /section/projects/item {title,tech,description}
"remove section X"→DELETE /section/X
"change theme"→PUT /meta {theme:{mood:X}}
"change color"→PUT /meta {theme:{accent:X}}
"add timeline entry"→POST /section/story/item {year,text}
"update item N in S"→PUT /section/S/item/N-1 {fields}
"delete item N in S"→DELETE /section/S/item/N-1
"move section S to position N"→PUT /section/S/move {to:N}
"add translation"→PUT /section/S {field:{"en":"...","zh":"..."}}
"change footer"→PUT /section/footer {text:X}
"add section"→POST /section {type,id,heading,items:[]}
