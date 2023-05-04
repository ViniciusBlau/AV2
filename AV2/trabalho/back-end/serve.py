from geral.config import *
from classe import *

@app.route("/")
def ola():
    return "backend fununciando"

@app.route("/incluir_aluno", methods=['POST'])
def incluir():

    dados = request.get_json()
    try:
        nova = Pessoa(**dados)

        db.session.add(nova)
        db.session.commit()

        return jsonify({"resultado": "ok"})
    except Exception as e:

        return jsonify({"resultado": "erro", "detalhes": str(e)})

@app.route("/listar_alunos")
def listar():
    # obter os dados da classe informada
    dados = db.session.query(Pessoa).all()

    # converter dados para json
    lista_jsons = [x.json() for x in dados]

    meujson = {"resultado": "ok"}
    meujson.update({"detalhes": lista_jsons})
    return jsonify(meujson)
        

with app.app_context():
    app.run(debug=True)