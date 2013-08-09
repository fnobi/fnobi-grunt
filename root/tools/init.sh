npm link {%
  for (var pkgname in pkg.devDependencies) {
    %}{%= pkgname %}@{%= pkg.devDependencies[pkgname] %} {%
  } %}
bower install
grunt
grunt server
