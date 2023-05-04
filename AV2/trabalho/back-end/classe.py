from geral.config import *

class Pessoa(db.Model):
    # atributos da pessoa
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.Text)
    tipo_sanguineo = db.Column(db.Text)
    cep = db.Column(db.Text)
    nascimento = db.Column(db.Text)
    campo_cpf = db.Column(db.Text)

    # método para expressar a pessoa em forma de texto
    def __str__(self):
        return self.nome + "[id="+str(self.id)+ "], " +\
            self.tipo_sanguineo + ", " + self.cep + ", " + self.nascimento + ", " + self.campo_cpf 
    # expressao da classe no formato json
    def json(self):
        return {
            "id": self.id,
            "nome": self.nome,
            "tipo_sanguineo": self.tipo_sanguineo,
            "cep": self.cep,
            "nascimento": self.nascimento,
            "cpf": self.campo_cpf
        }