.PHONY: install
install :
	composer install

.PHONY: lint
lint :
	phpcs src test

.PHONY: test
test :
	vendor/phpunit/phpunit/phpunit --colors
