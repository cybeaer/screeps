JSL := $(shell eslint --version 2> /dev/null)

test:
ifndef JSL
	$(error "eslint not installed - npm install -g eslint")
endif
	clear
	find . -name '*.js' -print0 | xargs -0 eslint --color

fix:
ifndef JSL
	$(error "eslint not installed - npm install -g eslint")
endif
	clear
	find . -name '*.js' -print0 | xargs -0 eslint --fix