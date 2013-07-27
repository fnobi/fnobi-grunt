cd {%= project_path %}
rm -rf *
grunt-init {%= template_name %}{% if (!pkg.devDependencies.length) { %}
npm link {%
  for (var pkgname in pkg.devDependencies) {
    %}{%= pkgname %}@{%= pkg.devDependencies[pkgname] %} {%
  }
%}{% } %}
grunt build