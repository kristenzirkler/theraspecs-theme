# Theraspecs Theme Files
## kristenzirkler

## To Work on Site Locally

* in terminal, navigate to the repo directory.
* jekyll serve --watch --baseurl='' (the baseurl option is empty on purpose)
* open browser and go to http://localhost:4000/

## Other Tips

* do not edit any files in _site
* you can have files in the main dir (todays-benefits.html) or directories to make pretty urls (/todays-benefits/index.html)
* URL set up static files & navigation like this so the urls are correct on production & local
http://stackoverflow.com/questions/14322329/site-root-github-pages-vs-jekyll-server
 * In the _config.yml file, add the variable baseurl (without trailing slash): 

 `baseurl: "http://user.github.io/project-name"`

 * In the layouts or pages, use absolute references, using the site.baseurl variable:

 `<link rel="stylesheet" href="{{ site.baseurl }}/css/styles.css">`
 
 Then, run the local server (the baseurl option is empty on purpose): 

 `jekyll serve --watch --baseurl=''`

* Formspree contact form is so fucking easy. http://formspree.io/ 
* Favicon Cheatsheet: https://github.com/audreyr/favicon-cheat-sheet