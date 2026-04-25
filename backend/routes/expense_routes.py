from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from extensions import db
from models.expense_model import Expense

expense_bp = Blueprint('expense', __name__)

@expense_bp.route('/expense', methods=['POST'])
@jwt_required()
def add_expense():
    user_id = int(get_jwt_identity())
    data = request.json

    expense = Expense(
        amount=data['amount'],
        category=data['category'],
        description=data.get('description', ''),
        user_id=user_id
    )

    db.session.add(expense)
    db.session.commit()

    return jsonify({"msg": "Added"})


@expense_bp.route('/expense', methods=['GET'])
@jwt_required()
def get_expenses():
    user_id = int(get_jwt_identity())
    category = request.args.get('category')

    query = Expense.query.filter_by(user_id=user_id)

    if category:
        query = query.filter_by(category=category)

    expenses = query.order_by(Expense.created_at.desc()).all()

    result = []
    for e in expenses:
        result.append({
            "id": e.id,
            "amount": e.amount,
            "category": e.category,
            "description": e.description
        })

    return jsonify(result)

@expense_bp.route('/expense/<int:id>', methods=['PUT'])
@jwt_required()
def update_expense(id):
    user_id = int(get_jwt_identity())

    expense = Expense.query.filter_by(id=id, user_id=user_id).first()
    if not expense:
        return jsonify({"msg": "Not found"}), 404

    data = request.json

    expense.amount = data.get('amount', expense.amount)
    expense.category = data.get('category', expense.category)
    expense.description = data.get('description', expense.description)

    db.session.commit()

    return jsonify({"msg": "Updated"})


@expense_bp.route('/expense/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_expense(id):
    user_id = int(get_jwt_identity())

    expense = Expense.query.filter_by(id=id, user_id=user_id).first()
    if not expense:
        return jsonify({"msg": "Not found"}), 404

    db.session.delete(expense)
    db.session.commit()

    return jsonify({"msg": "Deleted"})