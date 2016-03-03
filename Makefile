.PHONY: install
install :
	composer install

.PHONY: test
test :
	phpunit --colors
