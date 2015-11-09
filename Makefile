validate:
	node src/validator.js $(INPUT)
compare:
	node src/comparer.js $(INPUT) $(OUTPUT)
generate:
	node src/generator.js $(INPUT) $(OUTPUT)