from flask import Flask, request, jsonify
from flask_cors import CORS
from openai import OpenAI
import os
import logging
import re

client = OpenAI()

OpenAI.api_key = os.getenv('OPENAI_API_KEY')

# Function to generate a recipe
def generate_recipe(ingredients):
    stream = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
        {"role": "user", "content": f"Based on these ingredients: {ingredients}, I want you to create a recipe, but according \
         to these criteria: \
         It does not need to include every ingredient if it does not match in the recipe or if some ingredients \
         dont go well together. If some ingredients are needed but not listed, specifically list \
         what those ingredients are and tell the user what is needed. Now, I need you to generate a text based on this: \
        First, give the title formatted after 'Recipe:', explain what the recipe is (i.e. the taste profile, difficulty level, how long it takes to make \
         which includes prep and cook time. for prep and cook time, please format it after 'Total time:' and put \
         prep time and cook time), \
         then tell me what ingredients I need for this recipe. I want the ingredients formatted after 'Ingredients: ' \
         , and DO NOT use '-' as bullet points. just use new lines to separate ingredients. Ingredients \
         that are not provided in the first sentence should start with a #. For example, if i did not say apple but apples are \
         needed in the recipe, list the ingredient as #apple. I want each ingredient separated \
         by only a new line, no bullet points.  \
         For the instructions on how to make it, format after 'Instructions: ' and separate each step by a new line. In other words \
         before each step, put a new line. (such as before 2. and before 3.)"}
        ]
        
    )
    # return stream.choices[0].message.content
    response = stream.choices[0].message.content
    
    # Define regex patterns to capture each section
    recipe_title = re.search(r'Recipe:\s*(.*)', response)
    total_time = re.search(r'Total time:\s*(.*)', response)
    ingredients_section = re.search(r'Ingredients:\s*(.*?)(?=Additional note:|Instructions:|$)', response, re.DOTALL)
    instructions = re.search(r'Instructions:\s*(.*)', response, re.DOTALL)

    # Create a dictionary to structure the output
    recipe_data = {
        "recipe_title": recipe_title.group(1) if recipe_title else "",
        "total_time": total_time.group(1) if total_time else "",
        "ingredients": ingredients_section.group(1).strip() if ingredients_section else "",
        "instructions": instructions.group(1) if instructions else ""
    }

    return recipe_data


def explain_ingredients(title, instructions, ingredients):
    # print(title)
    # print(ingredients)
    stream = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
        {"role": "user", "content": f"From this title: {title} and {instructions}, explain \
         why each of these ingredients are used: {ingredients} by simply telling \
         the taste (sweet, salty, savory, bitter, etc.) and the texture. \
         Then, summarize how the ingredients work together in a dish."}
        ]
        
    )
    return stream.choices[0].message.content

def explain_instructions(title, instructions, ingredients):
    # print(title)
    # print(ingredients)
    stream = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
        {"role": "user", "content": f" Give no introduction to this response at all. \
         From this title: {title} and {ingredients}, explain \
         each step of the way in these instructions: {instructions} by telling me what \
         the step accomplishes and how it will end up in the dish. Do not include each step, \
         but rather only the explanation behind each step. Add a new line after each explanation."}
        ]
        
    )
    return stream.choices[0].message.content

    

    




app = Flask(__name__)
CORS(app)

# Set up logging
logging.basicConfig(level=logging.DEBUG)

@app.route('/generate_recipe', methods=['POST'])
def generate_recipe_endpoint():
    app.logger.debug('Received POST request for /generate_recipe')
    data = request.json
    app.logger.debug(f'Request data: {data}')
    ingredients = data.get('ingredients')
    if not ingredients:
        app.logger.debug('No ingredients provided')
        return jsonify({"error": "No ingredients provided"}), 400
    recipe = generate_recipe(ingredients)

    app.logger.debug(f'Generated recipe: {recipe}')
    return jsonify({"recipe": recipe})


@app.route('/explain_ingredients', methods=['POST'])
def explain_ingredients_endpoint():
    data = request.json
    title = data.get('recipe_title')
    instructions = data.get('instructions')
    ingredients = data.get('ingredients')
    
    if not title or not instructions or not ingredients:
        return jsonify({"error": "Incomplete data provided"}), 400
    
    explanation = explain_ingredients(title, instructions, ingredients)
    return jsonify({"explanation": explanation})



@app.route('/explain_instructions', methods=['POST'])
def explain_instructions_endpoint():
    data = request.json
    title = data.get('recipe_title')
    instructions = data.get('instructions')
    ingredients = data.get('ingredients')
    
    if not title or not instructions or not ingredients:
        return jsonify({"error": "Incomplete data provided"}), 400
    
    explanation = explain_instructions(title, instructions, ingredients)
    return jsonify({"explanation": explanation})



if __name__ == '__main__':
    app.run(debug=True)