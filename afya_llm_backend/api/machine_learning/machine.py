# creating a class instance of the machine learning api

""" machine will take user input and return a prediction """

class Machine:
    def __init__(self, user_input):
        self.user_input = user_input
        self.prediction = self.predict()

    def predict(self):
            return self.user_input
    
    def get_prediction(self):
        return self.prediction