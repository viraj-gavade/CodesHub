from flask import Flask, render_template, request, jsonify
import os
import pandas as pd
import numpy as np
from src.components.pipeline.prediction_pipeline import PredictionPipeline, CustomData
from src.utils.logger import logging

# Create Flask app
app = Flask(__name__, template_folder='templates', static_folder='static')

# Custom Jinja2 filters
@app.template_filter('thousands_separator')
def thousands_separator(value):
    return f"{int(value):,}"

@app.route('/', methods=['GET'])
def home():
    return render_template('index.html')

@app.route('/predict', methods=['GET', 'POST'])
def predict():
    if request.method == 'GET':
        return render_template('predict.html')
    else:
        try:
            # Get form data
            print('Received form data for prediction')
            name = request.form.get('name')
            year = int(request.form.get('year'))
            km_driven = int(request.form.get('km_driven'))
            fuel = request.form.get('fuel')
            seller_type = request.form.get('seller_t' \
            'ype')
            transmission = request.form.get('transmission')
            owner = request.form.get('owner')
            
            # Create CustomData object
            data = CustomData(
                name=name,
                year=year,
                selling_price=0,  # We'll predict this, so can use placeholder
                km_driven=km_driven,
                fuel=fuel,
                seller_type=seller_type,
                transmission=transmission,
                owner=owner
            )
            
            # Get data as dataframe
            df = data.get_data_as_dataframe()
            
            # Make prediction
            prediction_pipeline = PredictionPipeline()
            prediction = prediction_pipeline.predict(df)
            
            # Format prediction as INR - removing f-string to match template expectations
            predicted_price = int(prediction[0])
            
            logging.info(f"Prediction made: {predicted_price} for {name}")
            
            # Store form data to repopulate the form
            form_data = {
                'car_name': name,
                'year': year,
                'km_driven': km_driven,
                'fuel': fuel,
                'seller_type': seller_type,
                'transmission': transmission,
                'owner': owner
            }
            
            return render_template('predict.html', 
                                  prediction_made=True,
                                  predicted_price=predicted_price,
                                  form_data=form_data)
            
        except Exception as e:
            logging.error(f"Error in prediction: {str(e)}")
            return render_template('predict.html', 
                                  prediction_error=f"Error: {str(e)}. Please try again.")

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/visualization')
def visualization():
    # Load the data
    csv_path = os.path.join('Notebook', 'cars.csv')
    df = pd.read_csv(csv_path)
    
    # Generate some basic statistics
    total_cars = len(df)
    avg_price = int(df['selling_price'].mean())
    avg_year = int(df['year'].mean())
    
    # Count of cars by fuel type
    fuel_counts = df['fuel'].value_counts().to_dict()
    
    # Count of cars by transmission type
    transmission_counts = df['transmission'].value_counts().to_dict()
    
    # Count of cars by owner
    owner_counts = df['owner'].value_counts().to_dict()
    
    # Price range by fuel type
    price_by_fuel = df.groupby('fuel')['selling_price'].agg(['min', 'max', 'mean']).to_dict('index')
    for fuel, values in price_by_fuel.items():
        for stat, val in values.items():
            price_by_fuel[fuel][stat] = int(val)
    
    # Year distribution
    year_counts = df['year'].value_counts().sort_index().to_dict()
    
    return render_template('visualization.html',
                          total_cars=total_cars,
                          avg_price=avg_price,
                          avg_year=avg_year,
                          fuel_counts=fuel_counts,
                          transmission_counts=transmission_counts,
                          owner_counts=owner_counts,
                          price_by_fuel=price_by_fuel,
                          year_counts=year_counts)

# Run the application
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)