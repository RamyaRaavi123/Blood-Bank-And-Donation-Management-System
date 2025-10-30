from flask import Flask, render_template, request, redirect, url_for, flash
from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin, LoginManager, login_user, login_required, logout_user, current_user
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///events.db'
app.config['SECRET_KEY'] = 'secret123'
db = SQLAlchemy(app)
login_manager = LoginManager()
login_manager.login_view = "login"
login_manager.init_app(app)

# ------------------ MODELS ------------------

class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(150), unique=True, nullable=False)
    password = db.Column(db.String(150), nullable=False)
    is_admin = db.Column(db.Boolean, default=False)

class Event(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(150), nullable=False)
    capacity = db.Column(db.Integer, nullable=False)
    registrations = db.relationship('Registration', backref='event', lazy=True)

class Registration(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    event_id = db.Column(db.Integer, db.ForeignKey('event.id'), nullable=False)
    user = db.relationship("User", backref="user_registrations")
    __table_args__ = (
        db.UniqueConstraint('user_id', 'event_id', name='unique_user_event'),
    )

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

# ------------------ ROUTES ------------------

@app.route('/')
def home():
    events = Event.query.all()
    return render_template('home.html', events=events, background='images/home.jpg')

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        existing_user = User.query.filter_by(username=username).first()
        if existing_user:
            flash("Username already exists. Please choose a different one.")
            return redirect(url_for('register'))
        hashed_password = generate_password_hash(password, method="pbkdf2:sha256")
        user = User(username=username, password=hashed_password)
        db.session.add(user)
        db.session.commit()
        flash("Registration successful! Please log in.")
        return redirect(url_for('login'))
    return render_template('register.html', background='images/register.jpg')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        user = User.query.filter_by(username=username).first()
        if user and check_password_hash(user.password, password):
            login_user(user)
            return redirect(url_for('home'))
        flash("Invalid credentials")
    return render_template('login.html', background='images/login.jpg')

@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('home'))

@app.route('/event/<int:event_id>/join')
@login_required
def join_event(event_id):
    event = Event.query.get(event_id)
    if not event:
        flash("Event not found.")
        return redirect(url_for('home'))
    if len(event.registrations) >= event.capacity:
        flash(f"{event.name} is full! Cannot register.")
    else:
        already = Registration.query.filter_by(user_id=current_user.id, event_id=event_id).first()
        if not already:
            try:
                reg = Registration(user_id=current_user.id, event_id=event_id)
                db.session.add(reg)
                db.session.commit()
                flash(f"Successfully registered for {event.name}!")
            except Exception:
                db.session.rollback()
                flash(f"You are already registered for {event.name}.")
        else:
            flash(f"You are already registered for {event.name}.")
    return redirect(url_for('home'))

@app.route('/admin')
@login_required
def admin():
    if not current_user.is_admin:
        flash("Access denied!")
        return redirect(url_for('home'))
    events = Event.query.all()
    participants = {}
    for event in events:
        participants[event.id] = [r.user.username for r in event.registrations]
    return render_template('admin.html', events=events, participants=participants, background='images/admin.jpg')

@app.route('/dashboard')
@login_required
def dashboard():
    user_registrations = Registration.query.filter_by(user_id=current_user.id).all()
    events = Event.query.all()
    registered_event_ids = {reg.event_id for reg in user_registrations}
    return render_template('dashboard.html',
                           user_registrations=user_registrations,
                           events=events,
                           registered_event_ids=registered_event_ids,
                           background='images/dashboard.jpg')

# ------------------ INITIALIZE DB ------------------

with app.app_context():
    db.create_all()
    default_events = ["Hackathon 2025", "Workshop 2025", "Seminar 2025"]
    for ev in default_events:
        if not Event.query.filter_by(name=ev).first():
            db.session.add(Event(name=ev, capacity=100))
            db.session.commit()
    if not User.query.filter_by(username="admin").first():
        db.session.add(User(
            username="admin",
            password=generate_password_hash("admin", method="pbkdf2:sha256"),
            is_admin=True
        ))
        db.session.commit()

# ------------------ RUN ------------------

if __name__ == '__main__':
    app.run(debug=True)



